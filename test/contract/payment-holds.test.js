const path = require('path')
const { Pact } = require('@pact-foundation/pact')
const { name } = require('../../package')

describe('Payment Holds API', () => {
  const paymentHoldsPath = '/payment-holds'
  const paymentsServiceEndpointOriginal = process.env.PAYMENTS_SERVICE_ENDPOINT
  let paymentHolds

  const provider = new Pact({
    consumer: name,
    dir: path.resolve(process.cwd(), 'test-output'),
    logLevel: 'debug',
    provider: 'ffc-sfi-payments'
  })

  beforeAll(async () => {
    await provider.setup()
    const { mockService: { baseUrl } } = provider
    process.env.PAYMENTS_SERVICE_ENDPOINT = baseUrl
    paymentHolds = require('../../app/payment-holds')
  })

  afterEach(async () => {
    await provider.verify()
  })

  afterAll(async () => {
    await provider.finalize()
    process.env.PAYMENTS_SERVICE_ENDPOINT = paymentsServiceEndpointOriginal
  })

  describe('GET requests', () => {
    test('array with payment holds is returned when there are some', async () => {
      const expectedResponse = [{ paymentHoldId: 0 }, { paymentHoldId: 1 }]

      await provider.addInteraction({
        state: 'a list of holds exist',
        uponReceiving: 'a request for all payment holds',
        withRequest: {
          method: 'GET',
          path: paymentHoldsPath,
          headers: { Authorization: '' }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-type': 'application/json' },
          body: expectedResponse
        }
      })

      const response = await paymentHolds.getResponse(paymentHoldsPath)

      expect(response).toHaveProperty('payload')
      expect(response.payload).toEqual(expectedResponse)
    })

    test('empty array is returned when no payment holds exist', async () => {
      const expectedResponse = []
      await provider.addInteraction({
        state: 'no holds exist',
        uponReceiving: 'a request for all payment holds',
        withRequest: {
          method: 'GET',
          path: paymentHoldsPath,
          headers: { Authorization: '' }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-type': 'application/json' },
          body: expectedResponse
        }
      })

      const response = await paymentHolds.getResponse(paymentHoldsPath)

      expect(response).toHaveProperty('payload')
      expect(response.payload).toEqual(expectedResponse)
    })
  })
})
