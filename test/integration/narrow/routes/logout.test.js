describe('Logout test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /logout route redirects to /login', async () => {
    const options = {
      method: 'GET',
      url: '/logout'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login')
  })

  afterEach(async () => {
    await server.stop()
  })
})
