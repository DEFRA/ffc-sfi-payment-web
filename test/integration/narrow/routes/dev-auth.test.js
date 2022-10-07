describe('dev-auth test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /dev-auth route returns 302', async () => {
    const options = {
      method: 'GET',
      url: '/dev-auth'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /dev-auth route redirects to /', async () => {
    const options = {
      method: 'GET',
      url: '/dev-auth'
    }

    const response = await server.inject(options)
    expect(response.headers.location).toBe('/')
  })

  test('GET /dev-auth route calls dev-auth', async () => {
    const options = {
      method: 'GET',
      url: '/dev-auth'
    }

    await server.inject(options)
    expect(mockAuth.authenticate).toHaveBeenCalled()
  })

  afterEach(async () => {
    await server.stop()
  })
})
