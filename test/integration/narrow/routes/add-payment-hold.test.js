const cheerio = require('cheerio')
const createServer = require('../../../../app/server')

describe('Payment holds', () => {
  let server
  const url = '/add-payment-hold'

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  jest.mock('../../../../app/payment-holds')
  const { getResponse } = require('../../../../app/payment-holds')

  const paymentHoldCategories = [{
    holdCategoryId: 123,
    name: 'my hold category',
    schemeName: 'schemeName'
  }]
  const paymentHoldCategoriesResponseMock = { payload: { paymentHoldCategories } }

  describe('GET requests', () => {
    test('returns 200 and no hold categories when no categories returned in response', async () => {
      getResponse.mockResolvedValue({ payload: { paymentHoldCategories: [] } })

      const res = await server.inject({ method: 'GET', url })

      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('.govuk-summary-list__value select option').length).toEqual(0)
    })

    test('returns 200 and correctly lists returned hold category', async () => {
      getResponse.mockResolvedValue(paymentHoldCategoriesResponseMock)

      const res = await server.inject({ method: 'GET', url })

      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      const holdCategories = $('.govuk-summary-list__value select option')
      expect(holdCategories.length).toEqual(1)
      expect(holdCategories.text()).toEqual(`${paymentHoldCategories[0].name} With Scheme ${paymentHoldCategories[0].schemeName}`)
    })
  })
})
