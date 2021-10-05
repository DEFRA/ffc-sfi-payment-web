const nock = require('nock')
const api = require('../../app/api')
const { paymentsEndpoint } = require('../../app/config')

describe('API', () => {
  const url = '/request-path'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  const testCases = [
    { token: 'token', Authorization: 'token' },
    { token: null, Authorization: '' },
    { token: undefined, Authorization: '' }
  ]
  const responseMockData = { numbers: [0, 1, 2] }

  test.each(testCases)('Get makes GET request with auth header and returns response', async ({ token, Authorization }) => {
    const scope = nock(paymentsEndpoint, {
      reqheaders: {
        Authorization
      }
    })
      .get(url)
      .reply(200, responseMockData)

    const response = await api.get(url, token)

    expect(response).toHaveProperty('payload')
    expect(response.payload).toEqual(responseMockData)
    expect(scope.isDone()).toEqual(true)
  })

  test.each(testCases)('Post makes POST request with data and auth header and returns payload from response', async ({ token, Authorization }) => {
    const data = { hi: 'world' }
    const scope = nock(paymentsEndpoint, {
      reqheaders: {
        Authorization
      }
    })
      .post(url, data)
      .reply(200, responseMockData)

    const response = await api.post(url, data, token)

    expect(response).toEqual(responseMockData)
    expect(scope.isDone()).toEqual(true)
  })
})
