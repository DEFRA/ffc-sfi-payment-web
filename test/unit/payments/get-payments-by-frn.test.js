jest.mock('../../../app/payments/get-data')
const { getData: mockGetData } = require('../../../app/payments/get-data')

const { FRN: FRN_CATEGORY } = require('../../../app/constants/categories')

const { FRN: FRN_VALUE } = require('../../mocks/values/frn')
const { DATA } = require('../../mocks/values/data')

const { getPaymentsByFrn } = require('../../../app/payments/get-payments-by-frn')

describe('get payments by frn', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetData.mockResolvedValue(DATA)
  })

  test('should get data with FRN category and value', async () => {
    await getPaymentsByFrn(FRN_VALUE)
    expect(mockGetData).toHaveBeenCalledWith(FRN_CATEGORY, FRN_VALUE)
  })

  test('should return data', async () => {
    const result = await getPaymentsByFrn(FRN_VALUE)
    expect(result).toEqual(DATA)
  })
})
