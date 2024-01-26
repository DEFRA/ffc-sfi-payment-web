const { handleBulkPost } = require('../../../app/hold/handle-bulk-post') // Replace with your actual file name
const { post } = require('../../../app/api')
const { getHoldCategories } = require('../../../app/holds')
const { readFileContent } = require('../../../app/hold/read-file-content')
const { processHoldData } = require('../../../app/hold/process-hold-data')
const filePath = require('../../mocks/values/file-path')
const { FRN } = require('../../mocks/values/frn')

// Mock dependencies
jest.mock('../../../app/api')
jest.mock('../../../app/holds')
jest.mock('../../../app/hold/read-file-content')
jest.mock('../../../app/hold/process-hold-data')

let request
const h = {
  view: jest.fn(() => ({
    code: jest.fn(() => ({
      takeover: jest.fn()
    }))
  })),
  redirect: jest.fn()
}

const mockPaymentHoldCategories = [{
  holdCategoryId: 123,
  name: 'my hold category',
  schemeName: 'Scheme Name'
}]

describe('handle bulk post', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    request = {
      payload: {
        file: {
          path: filePath,
          filename: 'bulkHolds.csv',
          bytes: 123,
          headers: {
            'content-disposition': 'string',
            'content-type': 'text/csv'
          }
        },
        remove: false,
        holdCategoryId: '124'
      }
    }
    readFileContent.mockReturnValue(FRN)
    processHoldData.mockResolvedValue({ uploadData: [FRN], errors: null })
    getHoldCategories.mockResolvedValue({ schemes: ['Scheme Name'], paymentHoldCategories: mockPaymentHoldCategories })
  })

  test('should call readFileContent', async () => {
    await handleBulkPost(request, h)
    expect(readFileContent).toHaveBeenCalledWith(filePath)
  })

  test('should call processHoldData', async () => {
    await handleBulkPost(request, h)
    expect(processHoldData).toHaveBeenCalledWith(FRN)
  })

  test('should handle file content correctly if remove is false', async () => {
    await handleBulkPost(request, h)
    expect(post).toHaveBeenCalledWith('/payment-holds/bulk/add', {
      data: [FRN],
      holdCategoryId: '124'
    }, null)
  })

  test('should handle file content correctly if remove is true', async () => {
    request.payload.remove = true
    await handleBulkPost(request, h)
    expect(post).toHaveBeenCalledWith('/payment-holds/bulk/remove', {
      data: [FRN],
      holdCategoryId: '124'
    }, null)
    expect(h.redirect).toHaveBeenCalledWith('/payment-holds')
  })

  test('should redirect to payment-holds if successful', async () => {
    request.payload.remove = true
    await handleBulkPost(request, h)
    expect(h.redirect).toHaveBeenCalledWith('/payment-holds')
  })

  test('should handle null file content', async () => {
    readFileContent.mockReturnValue(null)
    await handleBulkPost(request, h)

    expect(getHoldCategories).toHaveBeenCalled()
    expect(h.view).toHaveBeenCalledWith('payment-holds/bulk', {
      schemes: ['Scheme Name'],
      paymentHoldCategories: mockPaymentHoldCategories,
      errors: { details: [{ message: 'An error occurred whilst reading the file' }] }
    })
    expect(h.redirect).not.toHaveBeenCalled()
  })

  test('should handle errors from processHoldData', async () => {
    processHoldData.mockResolvedValue({ uploadData: null, errors: { details: [{ message: 'These ARE the droids you\'re looking for!' }] } })
    await handleBulkPost(request, h)

    expect(getHoldCategories).toHaveBeenCalled()
    expect(h.view).toHaveBeenCalledWith('payment-holds/bulk', {
      schemes: ['Scheme Name'],
      paymentHoldCategories: mockPaymentHoldCategories,
      errors: { details: [{ message: 'These ARE the droids you\'re looking for!' }] }
    })
    expect(h.redirect).not.toHaveBeenCalled()
  })
})
