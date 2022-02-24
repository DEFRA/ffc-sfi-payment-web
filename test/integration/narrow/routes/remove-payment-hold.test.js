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
  const { getResponse, postRequest } = require('../../../../app/holds')

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

  function expectRequestForPaymentHolds (timesCalled = 1) {
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

    test('returns 200 and correctly lists returned holds', async () => {
      mockGetPaymentHold(paymentHolds)

      const res = await server.inject({ method, url })

      expectRequestForPaymentHolds()
      expect(res.statusCode).toBe(200)

      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const holds = $('tbody tr.govuk-table__row')
      expect(holds.length).toEqual(paymentHolds.length)
      holds.each((i, hold) => {
        const holdCells = $('td', hold)
        expect(holdCells.eq(0).text()).toEqual(paymentHolds[i].frn)
        expect(holdCells.eq(1).text()).toEqual(paymentHolds[i].holdCategoryName)
        expect(holdCells.eq(2).text()).toEqual(paymentHolds[i].holdCategorySchemeName)
        expect(holdCells.eq(3).text()).toEqual(paymentHolds[i].dateTimeAdded)
        expect(holdCells.eq(4).text()).toMatch('Remove')
      })
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
