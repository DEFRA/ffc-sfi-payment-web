jest.mock('../../../../app/auth')

jest.mock('../../../../app/config')
const config = require('../../../../app/config')

const createServer = require('../../../../app/server')

const { holdAdmin } = require('../../../../app/auth/permissions')

let server
let auth

describe('monitoring test', () => {
  beforeEach(async () => {
    config.useV1Events = true
    config.useV2Events = true
    auth = { strategy: 'session-auth', credentials: { scope: [holdAdmin] } }
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /monitoring route returns 403 if user not in role', async () => {
    auth.credentials.scope = []
    const options = {
      method: 'GET',
      url: '/monitoring',
      auth
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(403)
  })

  test('GET /monitoring route redirects to login page if not authorised', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring'
    }

    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toEqual('/login')
  })

  test('GET /monitoring route returns 200 if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /monitoring route returns monitoring view if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring',
      auth
    }

    const response = await server.inject(options)
    expect(response.payload).toContain('Monitoring')
  })

  test('GET /monitoring route redirects to event projection route if V2 events disabled', async () => {
    config.useV2Events = false
    const options = {
      method: 'GET',
      url: '/monitoring',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/event-projection')
  })


})
