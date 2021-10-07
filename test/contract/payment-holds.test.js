const { Pact } = require('@pact-foundation/pact')
const { name } = require('../../package')

describe('Payment Holds API', () => {
  const paymentHoldsPath = '/payment-holds'
  const paymentsServiceEndpointOriginal = process.env.PAYMENTS_SERVICE_ENDPOINT
  let paymentHolds

  const provider = new Pact({
    consumer: name,
    dir: './test/pacts',
    logLevel: 'debug',
    provider: 'ffc-sfi-payments'
  })

  const expectedResponse = [{ paymentHoldId: 0 }, { paymentHoldId: 1 }]
  // TODO: add more interactions e.g. no holds available, error from API
  const getPaymentHoldsInteraction = {
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
  }

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

  test('contract is correct for GET request', async () => {
    await provider.addInteraction(getPaymentHoldsInteraction)

    const response = await paymentHolds.getResponse(paymentHoldsPath)

    expect(response).toHaveProperty('payload')
    expect(response.payload).toEqual(expectedResponse)
  })
})
