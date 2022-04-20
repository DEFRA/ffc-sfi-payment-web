const { schemeAdmin } = require('../../../../app/auth/permissions')
let mockDownload
jest.mock('../../../../app/auth')
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockImplementation(() => {
        return {
          getContainerClient: jest.fn().mockImplementation(() => {
            return {
              createIfNotExists: jest.fn(),
              getBlockBlobClient: jest.fn().mockImplementation(() => {
                return {
                  download: mockDownload
                }
              })
            }
          })
        }
      })
    }
  }
})

describe('Report test', () => {
  const createServer = require('../../../../app/server')
  let server
  let auth

  beforeEach(async () => {
    mockDownload = jest.fn().mockReturnValue({
      readableStreamBody: 'Hello'
    })
    auth = { strategy: 'session-auth', credentials: { scope: [schemeAdmin] } }
    server = await createServer()
    await server.initialize()
  })

  test('GET /report route returns stream if report available', async () => {
    const options = {
      method: 'GET',
      url: '/report',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('Hello')
  })

  afterEach(async () => {
    await server.stop()
    jest.resetAllMocks()
  })

  test('GET /report route returns unavailable page if report not available', async () => {
    mockDownload = jest.fn().mockReturnValue(undefined)
    const options = {
      method: 'GET',
      url: '/report',
      auth
    }

    const response = await server.inject(options)
    console.log(response)
    expect(response.payload).toContain('Payment report unavailable')
  })

  afterEach(async () => {
    await server.stop()
  })
})
