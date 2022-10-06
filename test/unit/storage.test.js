const mockBlobContent = { test: 'test' }
const mockBlob = {
  download: jest.fn(),
  downloadToBuffer: jest.fn().mockResolvedValue(Buffer.from(JSON.stringify(mockBlobContent)))
}
const mockGetContainerClient = jest.fn()
const mockContainer = {
  createIfNotExists: jest.fn(),
  getBlockBlobClient: jest.fn().mockReturnValue(mockBlob)
}
const mockBlobServiceClient = {
  getContainerClient: mockGetContainerClient.mockReturnValue(mockContainer)
}
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockBlobServiceClient)
    }
  }
})
jest.mock('@azure/identity')
const storage = require('../../app/storage')

describe('storage', () => {
  test('getProjection returns blob buffer to string', async () => {
    const result = await storage.getProjection('test')
    expect(result).toStrictEqual(mockBlobContent)
  })
})
