jest.mock('../../../app/payments/get-data')
const { getData: mockGetData } = require('../../../app/payments/get-data')

const { DATA } = require('../../mocks/values/data')

const { SCHEME_ID: SCHEME_ID_CATEGORY } = require('../../../app/constants/categories')
const { SCHEME_VALUE } = require('../../../app/constants/scheme-value')

const { getPaymentsByScheme } = require('../../../app/payments')

describe('get payments by frn', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetData.mockResolvedValue(DATA)
  })

  test('should call mockGetData with schemeId category and value', async () => {
    await getPaymentsByScheme()
    expect(mockGetData).toHaveBeenCalledWith(SCHEME_ID_CATEGORY, SCHEME_VALUE)
  })

  test('should return DATA when getPaymentsBySchemeId is called', async () => {
    const result = await getPaymentsByScheme()
    expect(result).toEqual(DATA)
  })
})
