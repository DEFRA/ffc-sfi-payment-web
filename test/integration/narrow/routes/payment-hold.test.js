const cheerio = require('cheerio')
const createServer = require('../../../../app/server')

describe('Payment holds', () => {
  let server
  const url = '/payment-holds'
  const pageH1 = 'Payment Holds'
  // const validFrn = 1000000000

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  jest.mock('../../../../app/payment-holds')
  const { getResponse } = require('../../../../app/payment-holds')

  const paymentHolds = [
    {
      holdId: 1,
      frn: '1234567890',
      holdCategoryName: 'Outstanding debt',
      holdCategorySchemeId: 1,
      holdCategorySchemeName: 'SFI',
      dateTimeAdded: '2021-08-26T13:29:28.949Z',
      dateTimeClosed: null
    },
    {
      holdId: 4,
      frn: '1111111111',
      holdCategoryName: 'Outstanding debt',
      holdCategorySchemeId: 1,
      holdCategorySchemeName: 'SFI',
      dateTimeAdded: '2021-09-14T22:35:28.885Z',
      dateTimeClosed: '2021-09-14T22:41:44.659Z'
    }
  ]
  // const paymentHoldResponse = {
  //   payload: {
  //     paymentHold
  //   }
  // }

  function mockGetPaymentHold (paymentHolds) {
    getResponse.mockResolvedValue({ payload: { paymentHolds } })
  }

  function expectRequestForPaymentHold (timesCalled = 1) {
    expect(getResponse).toHaveBeenCalledTimes(timesCalled)
    expect(getResponse).toHaveBeenCalledWith('/payment-holds')
  }

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200 and no hold categories when no categories returned in response', async () => {
      mockGetPaymentHold([])

      const res = await server.inject({ method, url })

      expectRequestForPaymentHold()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      expect($('.govuk-body').text()).toEqual('No payment holds')
    })

    test('returns 200 and correctly lists returned hold category', async () => {
      mockGetPaymentHold(paymentHolds)

      const res = await server.inject({ method, url })

      // expectRequestForPaymentHold()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const holdCategories = $('.govuk-table__body')
      expect(holdCategories.length).toEqual(1)
      // expect(holdCategories.text()).toEqual(`${paymentHold[0].name} With Scheme ${paymentHold[0].schemeName}`)
    })
  })
})
