const mockBlobList = [{
  name: '1234567890/SFI123456789012/1/filename',
  properties: {
    lastModified: '2021-01-01T00:00:00.000Z'
  }
}]
const mockBlobContent = { test: 'test' }
const mockBlob = {
  download: jest.fn().mockResolvedValue(mockBlobContent),
  downloadToBuffer: jest.fn().mockResolvedValue(Buffer.from(JSON.stringify(mockBlobContent)))
}
const mockGetContainerClient = jest.fn()
const mockContainer = {
  createIfNotExists: jest.fn(),
  getBlockBlobClient: jest.fn().mockReturnValue(mockBlob),
  listBlobsFlat: jest.fn().mockResolvedValue(mockBlobList)
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
    const result = await storage.getProjection('filepath')
    expect(result).toStrictEqual(mockBlobContent)
  })

  test('getMIReport returns report data', async () => {
    const result = await storage.getMIReport('filepath')
    expect(result).toStrictEqual(mockBlobContent)
  })

  test('getBlobList returns blob list', async () => {
    const result = await storage.getBlobList('prefix')
    expect(result.blobList).toStrictEqual([{
      agreementNumber: 'SFI123456789012',
      blob: '1234567890/SFI123456789012/1/filename',
      fileName: 'filename',
      frn: '1234567890',
      requestNumber: '1',
      updatedDate: '01/01/2021 00:00:00'
    }])
  })
})
