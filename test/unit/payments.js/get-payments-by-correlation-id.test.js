jest.mock('../../../app/payments/get-data')
const { getData: mockGetData } = require('../../../app/payments/get-data')

const { CORRELATION_ID: CORRELATION_ID_CATEGORY } = require('../../../app/constants/categories')
const { CORRELATION_ID: CORRELATION_ID_VALUE } = require('../../mocks/values/correlation-id')
const { DATA } = require('../../mocks/values/data')

const { getPaymentsByCorrelationId } = require('../../../app/payments/get-payments-by-correlation-id')

describe('get payments by correlation-id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetData.mockResolvedValue(DATA)
  })

  test('should get data with FRN category and value', async () => {
    await getPaymentsByCorrelationId(CORRELATION_ID_VALUE)
    expect(mockGetData).toHaveBeenCalledWith(CORRELATION_ID_CATEGORY, CORRELATION_ID_VALUE)
  })

  test('should return data', async () => {
    const result = await getPaymentsByCorrelationId(CORRELATION_ID_VALUE)
    expect(result).toEqual(DATA)
  })
})
