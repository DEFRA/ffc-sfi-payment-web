const cheerio = require('cheerio')
const api = require('../../../../app/payment-holds')

describe('application task list route', () => {
  let createServer
  let server
  const paymentHoldCategories = [
    {
      holdCategoryId: 3,
      name: 'DAX rejection',
      schemeId: 1,
      schemeName: 'SFI'
    }
  ]
  const paymentHoldCategoriesResponse = {
    payload: {
      paymentHoldCategories
    }
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    api.getResponse = jest.fn()
    api.postRequest = jest.fn()
    createServer = require('../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /add-payment-hold returns 200 & correctly lists returned hold category', async () => {
    api.getResponse.mockReturnValue(paymentHoldCategoriesResponse)

    const options = {
      method: 'GET',
      url: '/add-payment-hold'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
    const $ = cheerio.load(result.payload)
    const holdCategories = $('.govuk-summary-list__value select option')
    expect(holdCategories.length).toEqual(1)
    expect(holdCategories.text()).toEqual(`${paymentHoldCategories[0].name} - ${paymentHoldCategories[0].schemeName}`)
  })
})
