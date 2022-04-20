const { schemeAdmin } = require('../../../../app/auth/permissions')
jest.mock('../../../../app/auth')

describe('Report test', () => {
  const createServer = require('../../../../app/server')
  let server
  let auth

  beforeEach(async () => {
    auth = { strategy: 'session-auth', credentials: { scope: [schemeAdmin] } }
    server = await createServer()
    await server.initialize()
  })

  test('GET /report route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/report',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
