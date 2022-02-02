const createServer = require('../../../../app/server')
const getCrumbs = require('../../../helpers/get-crumbs')

describe('Login tests', () => {
  let server
  const url = '/login'

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  jest.mock('../../../../app/azure-auth')
  const mockAzureAuth = require('../../../../app/azure-auth')

  const mockGetAuthenticationUrl = () => {
    mockAzureAuth.getAuthenticationUrl.mockResolvedValue('/')
  }

  describe('Login GET request', () => {
    const method = 'GET'
    test('GET /login route returns 200', async () => {
      const options = {
        method,
        url
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('Login POST requests', () => {
    const method = 'POST'

    test('redirects successful request to \'/\'', async () => {
      mockGetAuthenticationUrl('/')
      const mockForCrumbs = () => { return {} }
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual('/')
    })

    test('returns a 500 error due to try catch', async () => {
      mockAzureAuth.getAuthenticationUrl.mockImplementation(() => { throw new Error() })
      const mockForCrumbs = () => { return {} }
      const { cookieCrumb, viewCrumb } = await getCrumbs(mockForCrumbs, server, url)

      const res = await server.inject({
        method,
        url,
        payload: { crumb: viewCrumb },
        headers: { cookie: `crumb=${cookieCrumb}` }
      })

      expect(res.statusCode).toBe(500)
    })
  })
})
