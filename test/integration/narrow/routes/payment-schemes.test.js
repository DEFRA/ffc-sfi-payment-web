const cheerio = require('cheerio')
const createServer = require('../../../../app/server')
const getCrumbs = require('../../../helpers/get-crumbs')

describe('Payment schemes', () => {
  let server
  const url = '/payment-schemes'
  const pageH1 = 'Schemes'

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  jest.mock('../../../../app/api')
  const { get } = require('../../../../app/api')

  jest.mock('../../../../app/azure-auth')
  const { refresh } = require('../../../../app/azure-auth')

  const auth = {
    strategy: 'session-auth',
    isAuthenticated: true,
    credentials: {
      account: {
        name: 'A Farmer'
      }
    }
  }

  const paymentSchemes = [
    {
      schemeId: '1',
      name: 'SFI - active',
      active: true
    },
    {
      schemeId: '2',
      name: 'SFI - inactive',
      active: false
    }
  ]

  const mockAzureAuthRefresh = (viewPaymentScheme = true) => {
    refresh.mockResolvedValue({ viewPaymentScheme })
  }

  function mockGetPaymentSchemes (paymentSchemes) {
    get.mockResolvedValueOnce({ payload: { paymentSchemes } })
  }

  function expectRequestForPaymentSchemes (timesCalled = 1) {
    expect(get).toHaveBeenCalledTimes(timesCalled)
    expect(get).toHaveBeenCalledWith('/payment-schemes')
  }

  describe('GET requests', () => {
    const method = 'GET'

    test.each([
      { holdResponse: null },
      { holdResponse: undefined },
      { holdResponse: '' },
      { holdResponse: 0 },
      { holdResponse: false }
    ])('returns 500 and no response view when falsy value returned from getting payment schemes', async ({ holdResponse }) => {
      mockAzureAuthRefresh()
      get.mockResolvedValueOnce(holdResponse)

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentSchemes()
      expect(res.statusCode).toBe(500)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual('Sorry, there is a problem with the service')
      expect($('.govuk-body').text()).toEqual('Try again later.')
    })

    test('returns 200 and no schemes when non are returned', async () => {
      mockAzureAuthRefresh()
      mockGetPaymentSchemes([])

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentSchemes()
      expect(res.statusCode).toBe(200)

      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const content = $('.govuk-body').text()
      expect(content).toEqual('No available schemes')
    })

    test('returns 200 and correctly lists returned payment schemes', async () => {
      mockAzureAuthRefresh()
      mockGetPaymentSchemes(paymentSchemes)

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentSchemes()
      expect(res.statusCode).toBe(200)

      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const schemes = $('tbody tr.govuk-table__row')
      expect(schemes.length).toEqual(paymentSchemes.length)
      schemes.each((i, scheme) => {
        const schemeCells = $('td', scheme)
        expect(schemeCells.eq(0).text()).toEqual(paymentSchemes[i].name)
        expect(schemeCells.eq(1).text()).toEqual(paymentSchemes[i].active ? 'Active' : 'Inactive')
      })
    })

    test('returns 401 and redirects to / - no permission', async () => {
      mockGetPaymentSchemes(paymentSchemes)
      mockAzureAuthRefresh(false)
      const res = await server.inject({ method, url, auth })

      expect(res.statusCode).toBe(401)
      expect(res.headers.location).toEqual('/')
    })

    test('returns 302 and redirects to /login - no auth', async () => {
      mockAzureAuthRefresh()
      mockGetPaymentSchemes(paymentSchemes)

      const res = await server.inject({ method, url })

      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual('/login')
    })
  })

  describe('POST requests', () => {
    const method = 'POST'
    const schemeId = 1
    const schemeActive = true
    const schemeName = 'SFI scheme'

    test.each([
      { active: true },
      { active: false }
    ])('redirects to update payment scheme with correct argument values', async ({ active }) => {
      const name = 'SFI scheme'
      const mockForCrumbs = () => mockGetPaymentSchemes([paymentSchemes[0]])
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
      mockAzureAuthRefresh()
      const res = await server.inject({
        method,
        url,
        auth,
        payload: { crumb: viewCrumb, active, name, schemeId },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual(`/update-payment-scheme?schemeId=${schemeId}&active=${active}&name=${name}`)
    })

    describe('bad requests', () => {
      test.each([
        { viewCrumb: 'incorrect' },
        { viewCrumb: undefined }
      ])('returns 403 when view crumb is invalid or not included', async ({ viewCrumb }) => {
        const mockForCrumbs = () => mockGetPaymentSchemes([paymentSchemes[0]])
        const { cookieCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
        mockAzureAuthRefresh()
        const res = await server.inject({
          method,
          url,
          auth,
          payload: { crumb: viewCrumb, active: schemeActive, name: schemeName, schemeId },
          headers: { cookie: `crumb=${cookieCrumb}` }
        })

        expect(res.statusCode).toBe(403)
      })

      test.each([
        { cookieCrumb: 'incorrect' },
        { cookieCrumb: undefined }
      ])('returns 403 when cookie crumb is invalid or not included', async ({ cookieCrumb }) => {
        const mockForCrumbs = () => mockGetPaymentSchemes([paymentSchemes[0]])
        const { viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
        mockAzureAuthRefresh()
        const res = await server.inject({
          method,
          url,
          auth,
          payload: { crumb: viewCrumb, active: schemeActive, name: schemeName, schemeId },
          headers: { cookie: `crumb=${cookieCrumb}` }
        })

        expect(res.statusCode).toBe(403)
      })

      test('returns 401 no permission', async () => {
        const mockForCrumbs = () => mockGetPaymentSchemes([paymentSchemes[0]])
        const { viewCrumb, cookieCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
        mockAzureAuthRefresh(false)
        const res = await server.inject({
          method,
          url,
          auth,
          payload: { crumb: viewCrumb, active: schemeActive, name: schemeName, schemeId },
          headers: { cookie: `crumb=${cookieCrumb}` }
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})
