const cheerio = require('cheerio')
const createServer = require('../../../../app/server')
const getCrumbs = require('../../../helpers/get-crumbs')

describe('Payment holds', () => {
  let server
  const url = '/add-payment-hold'
  const pageH1 = 'Add payment hold'
  const validFrn = 1000000000

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  jest.mock('../../../../app/api')
  const { get, post } = require('../../../../app/api')

  const paymentHoldCategories = [{
    holdCategoryId: 123,
    name: 'my hold category',
    schemeName: 'schemeName'
  }]

  function mockGetPaymentHoldCategories (paymentHoldCategories) {
    get.mockResolvedValue({ payload: { paymentHoldCategories } })
  }

  function expectRequestForPaymentHoldCategories (timesCalled = 1) {
    expect(get).toHaveBeenCalledTimes(timesCalled)
    expect(get).toHaveBeenCalledWith('/payment-hold-categories')
  }

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200 and no hold categories when no categories returned in response', async () => {
      mockGetPaymentHoldCategories([])

      const res = await server.inject({ method, url })

      expectRequestForPaymentHoldCategories()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      expect($('.govuk-summary-list__value select option').length).toEqual(0)
    })

    test('returns 200 and correctly lists returned hold category', async () => {
      mockGetPaymentHoldCategories(paymentHoldCategories)

      const res = await server.inject({ method, url })

      expectRequestForPaymentHoldCategories()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const holdCategories = $('.govuk-summary-list__value select option')
      expect(holdCategories.length).toEqual(1)
      expect(holdCategories.text()).toEqual(`${paymentHoldCategories[0].name} - ${paymentHoldCategories[0].schemeName}`)
    })
  })

  describe('POST requests', () => {
    const method = 'POST'

    test('redirects successful request to \'/\' and correctly POSTs hold details', async () => {
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const holdCategory = 'hold this'
      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(post).toHaveBeenCalledTimes(1)
      expect(post).toHaveBeenCalledWith('/add-payment-hold', { frn: validFrn, holdCategoryId: holdCategory }, null)
      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual('/')
    })

    test.each([
      { viewCrumb: 'incorrect' },
      { viewCrumb: undefined }
    ])('returns 403 when view crumb is invalid or not included', async ({ viewCrumb }) => {
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { cookieCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const holdCategory = 'hold this'
      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(403)
    })

    test.each([
      { cookieCrumb: 'incorrect' },
      { cookieCrumb: undefined }
    ])('returns 400 when cookie crumb is invalid or not included', async ({ cookieCrumb }) => {
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { viewCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const holdCategory = 'hold this'
      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(400)
    })
  })
})
