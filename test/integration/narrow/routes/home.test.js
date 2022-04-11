const { holdAdmin } = require('../../../../app/auth/permissions')

describe('Home test', () => {
  jest.mock('../../../../app/api')
  jest.mock('../../../../app/auth')
  const createServer = require('../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [holdAdmin] } }

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /home route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload.username).toBe(auth.credentials.username)
  })

  test('GET /home route returns 302 no auth', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login')
  })

  afterEach(async () => {
    await server.stop()
  })
})
