const { renderErrorPage } = require('../../../app/helpers')
const { getSchemes } = require('../../../app/helpers/get-schemes')

jest.mock('../../../app/helpers/get-schemes')

describe('render error page', () => {
  let mockRequest, mockH, mockView, mockError, mockResponse

  beforeEach(() => {
    mockRequest = {
      log: jest.fn()
    }
    mockResponse = {
      code: jest.fn().mockReturnThis(),
      takeover: jest.fn().mockReturnThis()
    }
    mockH = {
      view: jest.fn().mockReturnValue(mockResponse)
    }
    mockView = 'some-view'
    mockError = {
      details: [
        { message: 'Error message 1', path: ['field1'] },
        { message: 'Error message 2', path: ['field2'] }
      ]
    }
    getSchemes.mockResolvedValue([{ name: 'Scheme 1' }, { name: 'Scheme 2' }])
  })

  test('logs error details', async () => {
    await renderErrorPage(mockView, mockRequest, mockH, mockError)
    expect(mockRequest.log).toHaveBeenCalledWith(['error', 'validation'], mockError)
  })

  test('retrieves schemes', async () => {
    await renderErrorPage(mockView, mockRequest, mockH, mockError)
    expect(getSchemes).toHaveBeenCalled()
  })

  test('renders the view with errors and schemes', async () => {
    await renderErrorPage(mockView, mockRequest, mockH, mockError)
    expect(mockH.view).toHaveBeenCalledWith(mockView, {
      schemes: [{ name: 'Scheme 1' }, { name: 'Scheme 2' }],
      errors: [
        { text: 'Error message 1', href: '#field1' },
        { text: 'Error message 2', href: '#field2' }
      ]
    })
  })

  test('returns a 400 response code', async () => {
    const response = await renderErrorPage(mockView, mockRequest, mockH, mockError)
    expect(response.code).toHaveBeenCalledWith(400)
  })

  test('calls takeover on the response', async () => {
    const response = await renderErrorPage(mockView, mockRequest, mockH, mockError)
    expect(response.takeover).toHaveBeenCalled()
  })
})
