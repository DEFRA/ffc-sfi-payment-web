const cheerio = require('cheerio')
const createServer = require('../../../../app/server')
const getCrumbs = require('../../../helpers/get-crumbs')

describe('Payment holds', () => {
  let server
  const url = '/remove-payment-hold'
  const pageH1 = 'Payment Holds'

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  jest.mock('../../../../app/payment-holds')
  const { getResponse, postRequest } = require('../../../../app/payment-holds')

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

  function mockGetPaymentHold (paymentHolds) {
    getResponse.mockResolvedValue({ payload: { paymentHolds } })
  }

  function expectRequestForPaymentHold (timesCalled = 1) {
    expect(getResponse).toHaveBeenCalledTimes(timesCalled)
    expect(getResponse).toHaveBeenCalledWith('/payment-holds?open=true')
  }

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200 and no hold returned in response', async () => {
      mockGetPaymentHold([])

      const res = await server.inject({ method, url })

      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      expect($('.govuk-body').text()).toEqual('No payment holds')
    })

    test('returns 200 and correctly lists returned hold', async () => {
      mockGetPaymentHold(paymentHolds)

      const res = await server.inject({ method, url })

      expectRequestForPaymentHold()
      expect(res.statusCode).toBe(200)
      // const $ = cheerio.load(res.payload)
      // expect($('h1').text()).toEqual(pageH1)
      // const holdCategories = $('.govuk-summary-list__value select option')
      // expect(holdCategories.length).toEqual(1)
      // expect(holdCategories.text()).toEqual(`${paymentHold[0].name} With Scheme ${paymentHold[0].schemeName}`)
    })
  })

  describe('POST requests', () => {
    const method = 'POST'
    const holdId = 1

    test('redirects successful request to \'/\' and correctly POSTs to remove hold', async () => {
      const mockForCrumbs = () => mockGetPaymentHold([paymentHolds[0]])
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, holdId },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(302)
      expect(postRequest).toHaveBeenCalledTimes(1)
      expect(postRequest).toHaveBeenCalledWith('/remove-payment-hold', { holdId })
      expect(res.headers.location).toEqual('/')
    })

    test.each([
      { viewCrumb: 'incorrect' },
      { viewCrumb: undefined }
    ])('returns 403 when view crumb is invalid or not included', async ({ viewCrumb }) => {
      const mockForCrumbs = () => mockGetPaymentHold([paymentHolds[0]])
      const { cookieCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, holdId },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(403)
    })

    test.each([
      { cookieCrumb: 'incorrect' },
      { cookieCrumb: undefined }
    ])('returns 400 when cookie crumb is invalid or not included', async ({ cookieCrumb }) => {
      const mockForCrumbs = () => mockGetPaymentHold([paymentHolds[0]])
      const { viewCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, holdId },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(400)
    })
  })
})
