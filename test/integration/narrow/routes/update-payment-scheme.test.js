describe('Update payment scheme test', () => {
  const createServer = require('../../../../app/server')
  const getCrumbs = require('../../../helpers/get-crumbs')
  let server
  const url = '/update-payment-scheme'

  jest.mock('../../../../app/azure-auth')
  const { refresh } = require('../../../../app/azure-auth')

  jest.mock('../../../../app/payment-holds')
  const { postRequest } = require('../../../../app/payment-holds')

  const mockAzureAuthRefresh = (updatePaymentScheme = true) => {
    refresh.mockResolvedValue({ updatePaymentScheme })
  }

  const auth = {
    strategy: 'session-auth',
    credentials: {
      account: {
        name: 'A Farmer'
      }
    }
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  test('GET /update-payment-scheme route returns 200', async () => {
    mockAzureAuthRefresh()
    const options = {
      method: 'GET',
      url,
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /update-payment-scheme route returns 302 and redirects /login - no auth', async () => {
    mockAzureAuthRefresh()
    const options = {
      method: 'GET',
      url
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login')
  })

  test('GET /update-payment-scheme route returns 401 and redirects / - invalid permission', async () => {
    mockAzureAuthRefresh(false)
    const options = {
      method: 'GET',
      url,
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(401)
    expect(response.headers.location).toEqual('/')
  })

  test('POST redirects successful request to /payment-scheme and correctly POSTs change-payment-status { schemeId: 1, active: false }', async () => {
    mockAzureAuthRefresh()
    const mockForCrumbs = () => { return {} }
    const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
    const schemeId = '1'

    const res = await server.inject({
      method: 'POST',
      url,
      auth,
      payload: { crumb: viewCrumb, scheme: 'true', schemeId, name: 'test', active: 'true' },
      headers: { cookie: `crumb=${cookieCrumb}` }
    })

    expect(postRequest).toHaveBeenCalledTimes(1)
    expect(postRequest).toHaveBeenCalledWith('/change-payment-status', { schemeId, active: false })
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toEqual('/payment-schemes')
  })

  test('POST redirects successful request to /payment-scheme and correctly POSTs change-payment-status { schemeId: 1, active: true }', async () => {
    mockAzureAuthRefresh()
    const mockForCrumbs = () => { return {} }
    const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
    const schemeId = '1'

    const res = await server.inject({
      method: 'POST',
      url,
      auth,
      payload: { crumb: viewCrumb, scheme: 'true', schemeId, name: 'test', active: 'false' },
      headers: { cookie: `crumb=${cookieCrumb}` }
    })

    expect(postRequest).toHaveBeenCalledTimes(1)
    expect(postRequest).toHaveBeenCalledWith('/change-payment-status', { schemeId, active: true })
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toEqual('/payment-schemes')
  })

  test('POST redirects successful request to /payment-scheme and no POSTs change-payment-status', async () => {
    mockAzureAuthRefresh()
    const mockForCrumbs = () => { return {} }
    const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
    const schemeId = '1'

    const res = await server.inject({
      method: 'POST',
      url,
      auth,
      payload: { crumb: viewCrumb, scheme: 'false', schemeId, name: 'test', active: 'false' },
      headers: { cookie: `crumb=${cookieCrumb}` }
    })

    expect(postRequest).toHaveBeenCalledTimes(0)
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toEqual('/payment-schemes')
  })

  test('POST cause a fail error with 400', async () => {
    mockAzureAuthRefresh()
    const mockForCrumbs = () => { return {} }
    const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
    const schemeId = '1'

    const res = await server.inject({
      method: 'POST',
      url,
      auth,
      payload: { crumb: viewCrumb, scheme: schemeId, name: 'test', active: 'false' },
      headers: { cookie: `crumb=${cookieCrumb}` }
    })

    expect(postRequest).toHaveBeenCalledTimes(0)
    expect(res.statusCode).toBe(400)
  })

  test('POST redirects to / with 401 - incorrect permission', async () => {
    const mockForCrumbs = () => { return {} }
    const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url, auth)
    const schemeId = '1'

    mockAzureAuthRefresh(false)

    const res = await server.inject({
      method: 'POST',
      url,
      auth,
      payload: { crumb: viewCrumb, scheme: 'false', schemeId, name: 'test', active: 'false' },
      headers: { cookie: `crumb=${cookieCrumb}` }
    })

    expect(res.statusCode).toBe(401)
    expect(res.headers.location).toEqual('/')
  })

  afterEach(async () => {
    await server.stop()
  })
})
