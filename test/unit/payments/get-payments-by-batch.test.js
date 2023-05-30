jest.mock('../../../app/payments/get-data')
const { getData: mockGetData } = require('../../../app/payments/get-data')

const { BATCH: BATCH_VALUE } = require('../../mocks/values/batch')
const { DATA } = require('../../mocks/values/data')

const { BATCH: BATCH_CATEGORY } = require('../../../app/constants/categories')

const { getPaymentsByBatch } = require('../../../app/payments/get-payments-by-batch')

describe('get payments by BATCH', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetData.mockResolvedValue(DATA)
  })

  test('should get data with BATCH category and value', async () => {
    await getPaymentsByBatch(BATCH_VALUE)
    expect(mockGetData).toHaveBeenCalledWith(BATCH_CATEGORY, BATCH_VALUE)
  })

  test('should return data', async () => {
    const result = await getPaymentsByBatch(BATCH_VALUE)
    expect(result).toEqual(DATA)
  })
})
