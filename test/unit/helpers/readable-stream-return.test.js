const { readableStreamReturn } = require('../../../app/helpers')

describe('readable stream return', () => {
  let mockResponse
  let mockH

  beforeEach(() => {
    mockResponse = {
      type: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis()
    }
    mockH = { response: jest.fn().mockReturnValue(mockResponse) }
  })

  test('should correctly set headers and return the response', async () => {
    const response = { readableStreamBody: 'stream content' }
    const reportName = 'report.csv'

    const result = await readableStreamReturn(response, mockH, reportName)

    expect(mockH.response).toHaveBeenCalledWith(response.readableStreamBody)
    expect(mockResponse.type).toHaveBeenCalledWith('text/csv')
    expect(mockResponse.header).toHaveBeenCalledWith('Connection', 'keep-alive')
    expect(mockResponse.header).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(mockResponse.header).toHaveBeenCalledWith(
      'Content-Disposition',
      `attachment;filename=${reportName}`
    )
    expect(result).toBe(mockResponse)
  })

  test('should handle a different report name', async () => {
    const response = { readableStreamBody: 'different stream' }
    const reportName = 'another-report.csv'

    const result = await readableStreamReturn(response, mockH, reportName)

    expect(mockH.response).toHaveBeenCalledWith(response.readableStreamBody)
    expect(mockResponse.type).toHaveBeenCalledWith('text/csv')
    expect(mockResponse.header).toHaveBeenCalledWith('Connection', 'keep-alive')
    expect(mockResponse.header).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(mockResponse.header).toHaveBeenCalledWith(
      'Content-Disposition',
      `attachment;filename=${reportName}`
    )
    expect(result).toBe(mockResponse)
  })

  test('should correctly handle an empty stream body', async () => {
    const response = { readableStreamBody: '' }
    const reportName = 'empty-report.csv'

    const result = await readableStreamReturn(response, mockH, reportName)

    expect(mockH.response).toHaveBeenCalledWith(response.readableStreamBody)
    expect(mockResponse.type).toHaveBeenCalledWith('text/csv')
    expect(mockResponse.header).toHaveBeenCalledWith('Connection', 'keep-alive')
    expect(mockResponse.header).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(mockResponse.header).toHaveBeenCalledWith(
      'Content-Disposition',
      `attachment;filename=${reportName}`
    )
    expect(result).toBe(mockResponse)
  })
})
