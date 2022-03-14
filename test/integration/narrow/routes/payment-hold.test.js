const cheerio = require('cheerio')
const createServer = require('../../../../app/server')

describe('Payment holds', () => {
  let server
  const url = '/payment-holds'
  const pageH1 = 'Payment Holds'

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  jest.mock('../../../../app/api')
  const { get } = require('../../../../app/api')

  jest.mock('../../../../app/auth/azure-auth')
  const { refresh } = require('../../../../app/auth/azure-auth')

  const auth = {
    strategy: 'session-auth',
    credentials: {
      account: {
        name: 'A Farmer'
      },
      permissions: {
        holdAdmin: true
      }
    }
  }

  const mockPaymentHolds = [
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

  const mockAzureAuthRefresh = (holdAdmin = true) => {
    refresh.mockResolvedValue({ holdAdmin })
  }

  function mockGetPaymentHold (paymentHolds) {
    get.mockResolvedValue({ payload: { paymentHolds } })
  }

  function expectRequestForPaymentHold (timesCalled = 1) {
    expect(get).toHaveBeenCalledTimes(timesCalled)
    expect(get).toHaveBeenCalledWith('/payment-holds')
  }

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200 and no hold categories when no categories returned in response', async () => {
      mockGetPaymentHold([])
      mockAzureAuthRefresh()

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentHold()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      expect($('#no-hold-text').text()).toEqual('No current payment holds')
    })

    test('returns 401 no viewPaymentHolds permission', async () => {
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
      mockGetPaymentHold(mockPaymentHolds)
      mockAzureAuthRefresh()

      const res = await server.inject({ method, url, auth })

      expectRequestForPaymentHold()
      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      const holds = $('.govuk-table__body tr')
      expect(holds.length).toEqual(1)
      holds.each((i, hold) => {
        const holdCells = $('td', hold)
        expect(holdCells.eq(0).text()).toEqual(mockPaymentHolds[i].frn)
        expect(holdCells.eq(1).text()).toEqual(mockPaymentHolds[i].holdCategoryName)
        expect(holdCells.eq(2).text()).toEqual(mockPaymentHolds[i].holdCategorySchemeName)
        expect(holdCells.eq(3).text()).toEqual(mockPaymentHolds[i].dateTimeAdded)
      })
    })
  })
})
