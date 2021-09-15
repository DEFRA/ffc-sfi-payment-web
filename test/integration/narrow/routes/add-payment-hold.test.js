const cheerio = require('cheerio')
const createServer = require('../../../../app/server')

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

  jest.mock('../../../../app/payment-holds')
  const { getResponse, postRequest } = require('../../../../app/payment-holds')

  const paymentHoldCategories = [{
    holdCategoryId: 123,
    name: 'my hold category',
    schemeName: 'schemeName'
  }]

  function mockGetPaymentHoldCategories (paymentHoldCategories) {
    getResponse.mockResolvedValue({ payload: { paymentHoldCategories } })
  }

  function expectRequestForPaymentHoldCategories (timesCalled = 1) {
    expect(getResponse).toHaveBeenCalledTimes(timesCalled)
    expect(getResponse).toHaveBeenCalledWith('/payment-hold-categories')
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

  /**
   * Make an initial request to get crumbs (CSRF tokens) so that subsequent
   * requests are valid.
   *
   * @returns {object} object contain crumbs for view and cookie.
   */
  async function getCrumbs (url) {
    mockGetPaymentHoldCategories([])
    const initRes = await server.inject({ method: 'GET', url })
    const initHeader = initRes.headers['set-cookie']

    const $ = cheerio.load(initRes.payload)
    const viewCrumb = $('input[name=crumb]').val()
    const cookieCrumb = initHeader[0].match(/crumb=([^",;\\\x7F]*)/)[1]
    return {
      cookieCrumb,
      viewCrumb
    }
  }

  describe('POST requests', () => {
    const method = 'POST'

    test('redirects successful request to \'/\' and correctly POSTs hold details', async () => {
      const { cookieCrumb, viewCrumb } = await getCrumbs(url)

      const holdCategory = 'hold this'
      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(postRequest).toHaveBeenCalledTimes(1)
      expect(postRequest).toHaveBeenCalledWith('/add-payment-hold', { frn: validFrn, holdCategoryId: holdCategory }, null)
      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual('/')
    })

    test.each([
      { frn: 10000000001, holdCategory: 'hold-me', expectedErrorMessage: 'The FRN is too long.' },
      { frn: 999999998, holdCategory: 'thrill-me', expectedErrorMessage: 'The FRN is too short.' },
      { frn: 'not-a-number', holdCategory: 'kiss-me', expectedErrorMessage: 'The FRN must be a number.' },
      { frn: undefined, holdCategory: 'kill-me', expectedErrorMessage: 'The FRN is invalid.' },
      { frn: 1000000000, holdCategory: undefined, expectedErrorMessage: 'The FRN is invalid.' }
    ])('returns 400 and view with errors when request fails validation - %p', async ({ frn, holdCategory, expectedErrorMessage }) => {
      const { cookieCrumb, viewCrumb } = await getCrumbs(url)

      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb, frn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expectRequestForPaymentHoldCategories(2)
      expect(res.statusCode).toBe(400)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      expect($('.govuk-error-summary__title').text()).toMatch('There is a problem')
      const errorMessage = $('.govuk-error-message')
      expect(errorMessage.length).toEqual(1)
      expect(errorMessage.text()).toMatch(`Error: ${expectedErrorMessage}`)
    })

    test.each([
      { viewCrumb: 'incorrect' },
      { viewCrumb: undefined }
    ])('returns 403 when view crumb is invalid or not included', async ({ viewCrumb }) => {
      const { cookieCrumb } = await getCrumbs(url)

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
      const { viewCrumb } = await getCrumbs(url)

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
