jest.mock('../../../app/payments/get-data')
const { getData: mockGetData } = require('../../../app/payments/get-data')

const { SCHEME_ID: SCHEME_ID_CATEGORY } = require('../../../app/constants/categories')
const { SCHEME_ID_VALUE } = require('../../../app/constants/scheme-id-value')

const { DATA } = require('../../mocks/values/data')

const { getPaymentsBySchemeId } = require('../../../app/payments')

describe('get payments by frn', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetData.mockResolvedValue(DATA)
  })

  test('should get data with FRN category and value', async () => {
    await getPaymentsBySchemeId()
    expect(mockGetData).toHaveBeenCalledWith(SCHEME_ID_CATEGORY, SCHEME_ID_VALUE)
  })

  test('should return data', async () => {
    const result = await getPaymentsBySchemeId()
    expect(result).toEqual(DATA)
  })
})
