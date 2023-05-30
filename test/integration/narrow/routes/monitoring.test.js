jest.mock('../../../../app/auth')

jest.mock('../../../../app/config')
const config = require('../../../../app/config')

jest.mock('../../../../app/payments')
const { getPaymentsByFrn: mockGetPaymentsByFrn, getPaymentsByCorrelationId: mockGetPaymentsByCorrelationId, getPaymentsByBatch: mockGetPaymentsByBatch } = require('../../../../app/payments')

const { DATA } = require('../../../mocks/values/data')

const { holdAdmin } = require('../../../../app/auth/permissions')

const createServer = require('../../../../app/server')

let server
let auth

describe('monitoring test', () => {
  beforeEach(async () => {
    config.useV1Events = true
    config.useV2Events = true

    auth = { strategy: 'session-auth', credentials: { scope: [holdAdmin] } }

    mockGetPaymentsByCorrelationId.mockResolvedValue(DATA)
    mockGetPaymentsByFrn.mockResolvedValue(DATA)
    mockGetPaymentsByBatch.mockResolvedValue(DATA)

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

    const response = await server.inject(options)
    expect(response.statusCode).toBe(403)
  })

  test('GET /monitoring route redirects to login page if not authorised', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login')
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

  test('GET /monitoring route returns 404 if V2 events disabled', async () => {
    config.useV2Events = false
    const options = {
      method: 'GET',
      url: '/monitoring',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /monitoring/payments/frn route returns 403 if user not in role', async () => {
    auth.credentials.scope = []
    const options = {
      method: 'GET',
      url: '/monitoring/payments/frn',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(403)
  })

  test('GET /monitoring/payments/frn route redirects to login page if not authorised', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/payments/frn'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login')
  })

  test('GET /monitoring/payments/frn route returns 200 if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/payments/frn',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /monitoring/payments/frn route returns monitoring frn view if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/payments/frn',
      auth
    }

    const response = await server.inject(options)
    expect(response.payload).toContain('Monitoring')
  })

  test('GET /monitoring/payments/frn route returns 404 if V2 events disabled', async () => {
    config.useV2Events = false
    const options = {
      method: 'GET',
      url: '/monitoring/payments/correlation-id',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /monitoring/payments/correlation-id route returns 403 if user not in role', async () => {
    auth.credentials.scope = []
    const options = {
      method: 'GET',
      url: '/monitoring/payments/correlation-id',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(403)
  })

  test('GET /monitoring/payments/correlation-id route redirects to login page if not authorised', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/payments/correlation-id'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login')
  })

  test('GET /monitoring/payments/correlation-id route returns 200 if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/payments/correlation-id',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /monitoring/payments/correlation-id route returns monitoring frn view if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/payments/correlation-id',
      auth
    }

    const response = await server.inject(options)
    expect(response.payload).toContain('Monitoring')
  })

  test('GET /monitoring/payments/correlation-id route returns 404 if V2 events disabled', async () => {
    config.useV2Events = false
    const options = {
      method: 'GET',
      url: '/monitoring/payments/correlation-id',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /monitoring/batch/name route returns 403 if user not in role', async () => {
    auth.credentials.scope = []
    const options = {
      method: 'GET',
      url: '/monitoring/batch/name',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(403)
  })

  test('GET /monitoring/batch/name route redirects to login page if not authorised', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/batch/name'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login')
  })

  test('GET /monitoring/batch/name route returns 200 if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/batch/name',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /monitoring/batch/name route returns monitoring batch view if V2 events enabled', async () => {
    const options = {
      method: 'GET',
      url: '/monitoring/batch/name',
      auth
    }

    const response = await server.inject(options)
    expect(response.payload).toContain('Monitoring')
  })

  test('GET /monitoring/batch/name route returns 404 if V2 events disabled', async () => {
    config.useV2Events = false
    const options = {
      method: 'GET',
      url: '/monitoring/batch/name',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })
})
