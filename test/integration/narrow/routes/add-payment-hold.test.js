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

  jest.mock('../../../../app/azure-auth')
  const { refresh } = require('../../../../app/auth/azure-auth')

  const auth = {
    strategy: 'session-auth',
    isAuthenticated: true,
    credentials: {
      account: {
        name: 'A Farmer'
      }
    }
  }

  const paymentHoldCategories = [{
    holdCategoryId: 123,
    name: 'my hold category',
    schemeName: 'schemeName'
  }]

  const mockAzureAuthRefresh = (holdAdmin = true) => {
    refresh.mockResolvedValue({ holdAdmin })
  }

  const mockGetPaymentHoldCategories = (paymentHoldCategories) => {
    get.mockResolvedValue({ payload: { paymentHoldCategories } })
  }

  const expectRequestForPaymentHoldCategories = (timesCalled = 1) => {
    expect(get).toHaveBeenCalledTimes(timesCalled)
    expect(get).toHaveBeenCalledWith('/payment-hold-categories')
  }

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200 and no hold categories when no categories returned in response', async () => {
      mockAzureAuthRefresh()
      mockGetPaymentHoldCategories([])

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentHoldCategories()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      expect($('.govuk-radios__input').length).toEqual(0)
    })

    test('returns 401 and no addPaymentHold permission', async () => {
      mockAzureAuthRefresh(false)
      const res = await server.inject({ method, url, auth })
      expect(res.statusCode).toBe(401)
      expect(res.headers.location).toEqual('/')
    })

    test('returns 302 no auth', async () => {
      const res = await server.inject({ method, url })
      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual('/login')
    })

    test('returns 200 and correctly lists returned hold category', async () => {
      mockAzureAuthRefresh()
      mockGetPaymentHoldCategories(paymentHoldCategories)

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentHoldCategories()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const holdCategories = $('.govuk-radios__input')
      expect(holdCategories.length).toEqual(1)
      expect(holdCategories.val()).toEqual('123')
    })
  })

  describe('POST requests', () => {
    const method = 'POST'

    test('redirects successful request to \'/\' and correctly POSTs hold details', async () => {
      mockAzureAuthRefresh()
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)

      const holdCategoryId = 1
      const res = await server.inject({
        method,
        url,
        auth,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategoryId },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(post).toHaveBeenCalledTimes(1)
      expect(post).toHaveBeenCalledWith('/add-payment-hold', { frn: validFrn, holdCategoryId: holdCategoryId }, null)
      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual('/payment-holds')
    })

    test('redirects unauthorized request to \'/\' and no addPaymentHold permission', async () => {
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
      mockAzureAuthRefresh(false)
      const holdCategory = 'hold this'
      const res = await server.inject({
        method,
        url,
        auth,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(401)
      expect(res.headers.location).toEqual('/')
    })

    test.each([
      { frn: 10000000001, holdCategoryId: 1, expectedErrorMessage: 'FRN is invalid' },
      { frn: 999999998, holdCategoryId: 1, expectedErrorMessage: 'FRN is invalid' },
      { frn: 'not-a-number', holdCategoryId: 1, expectedErrorMessage: 'FRN is invalid' },
      { frn: undefined, holdCategoryId: 1, expectedErrorMessage: 'FRN is invalid' },
      { frn: 1000000000, holdCategoryId: undefined, expectedErrorMessage: 'Category is required' }
    ])('returns 400 and view with errors when request fails validation - %p', async ({ frn, holdCategoryId, expectedErrorMessage }) => {
      mockAzureAuthRefresh()
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)

      const res = await server.inject({
        method,
        url,
        auth,
        payload: { crumb: viewCrumb, frn, holdCategoryId },
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
      mockAzureAuthRefresh()
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { cookieCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)

      const holdCategory = 'hold this'
      const res = await server.inject({
        method,
        url,
        auth,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(403)
    })

    test.each([
      { cookieCrumb: 'incorrect' },
      { cookieCrumb: undefined }
    ])('returns 403 when cookie crumb is invalid or not included', async ({ cookieCrumb }) => {
      mockAzureAuthRefresh()
      const mockForCrumbs = () => mockGetPaymentHoldCategories([])
      const { viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)

      const holdCategory = 'hold this'
      const res = await server.inject({
        method,
        url,
        auth,
        payload: { crumb: viewCrumb, frn: validFrn, holdCategory },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(403)
    })
  })
})
