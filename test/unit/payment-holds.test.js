
describe('Payment holds', () => {
  const paymentHolds = require('../../app/payment-holds')
  jest.mock('../../app/api')
  const api = require('../../app/api')

  const errorMessage = 'something has gone wrong'
  const url = 'https://a.url.com'

  const consoleErrorSpy = jest.spyOn(console, 'error')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getResponse', () => {
    test('returns response when no error', async () => {
      const mockResponse = 'something'
      api.get.mockResolvedValueOnce(mockResponse)

      const response = await paymentHolds.getResponse(url)

      expect(response).toEqual(mockResponse)
      expect(api.get).toHaveBeenCalledTimes(1)
      expect(api.get).toHaveBeenCalledWith(url)
    })

    test('returns undefined when error occurrs', async () => {
      const error = new Error(errorMessage)
      api.get.mockRejectedValueOnce(error)

      const response = await paymentHolds.getResponse(url)

      expect(response).toEqual(undefined)
      expect(api.get).toHaveBeenCalledTimes(1)
      expect(api.get).toHaveBeenCalledWith(url)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })
  })

  describe('postRequest', () => {
    const data = 123
    const token = 'token'

    test('returns response when no error', async () => {
      const mockResponse = 'something'
      api.post.mockResolvedValueOnce(mockResponse)

      const response = await paymentHolds.postRequest(url, data, token)

      expect(response).toEqual(mockResponse)
      expect(api.post).toHaveBeenCalledTimes(1)
      expect(api.post).toHaveBeenCalledWith(url, data, token)
    })

    test('returns undefined when error occurrs', async () => {
      const error = new Error(errorMessage)
      api.post.mockRejectedValueOnce(error)

      const response = await paymentHolds.postRequest(url, data, token)

      expect(response).toEqual(undefined)
      expect(api.post).toHaveBeenCalledTimes(1)
      expect(api.post).toHaveBeenCalledWith(url, data, token)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })
  })
})
