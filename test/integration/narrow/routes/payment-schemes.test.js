const cheerio = require('cheerio')
const createServer = require('../../../../app/server')

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

  jest.mock('../../../../app/auth')
  const { refresh } = require('../../../../app/auth')

  const auth = {
    strategy: 'session-auth',
    isAuthenticated: true,
    credentials: {
      account: {
        name: 'A Farmer'
      }
    }
  }

  const mockPaymentSchemes = [
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

  const mockAzureAuthRefresh = (schemeAdmin = true) => {
    refresh.mockResolvedValue({ schemeAdmin })
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
      mockGetPaymentSchemes(mockPaymentSchemes)

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentSchemes()
      expect(res.statusCode).toBe(200)

      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const schemes = $('tbody tr.govuk-table__row')
      expect(schemes.length).toEqual(mockPaymentSchemes.length)
      schemes.each((i, scheme) => {
        const schemeCells = $('td', scheme)
        expect(schemeCells.eq(0).text()).toEqual(mockPaymentSchemes[i].name)
        expect(schemeCells.eq(1).text()).toEqual(mockPaymentSchemes[i].active ? 'Active' : 'Inactive')
      })
    })

    test('returns 401 and redirects to / - no permission', async () => {
      mockGetPaymentSchemes(mockPaymentSchemes)
      mockAzureAuthRefresh(false)
      const res = await server.inject({ method, url, auth })

      expect(res.statusCode).toBe(401)
      expect(res.headers.location).toEqual('/')
    })

    test('returns 302 and redirects to /login - no auth', async () => {
      mockAzureAuthRefresh()
      mockGetPaymentSchemes(mockPaymentSchemes)

      const res = await server.inject({ method, url })

      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual('/login')
    })
  })
})
