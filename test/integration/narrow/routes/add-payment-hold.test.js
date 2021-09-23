const api = require('../../../../app/payment-holds')

describe('application task list route', () => {
  let createServer
  let server

  beforeEach(async () => {
    api.getResponse = jest.fn()
    api.postRequest = jest.fn()
    createServer = require('../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /add-payment-hold returns 200', async () => {
    const paymentHoldCategoriesResponse = {
      payload: {
        paymentHoldCategories: {}
      }
    }

    api.getResponse.mockReturnValue(paymentHoldCategoriesResponse)

    const options = {
      method: 'GET',
      url: '/add-payment-hold'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })
})
