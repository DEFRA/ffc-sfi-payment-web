const { handleStreamResponse } = require('../../../app/helpers')
const { readableStreamReturn } = require('../../../app/helpers/readable-stream-return')

jest.mock('../../../app/helpers/readable-stream-return')

describe('handle stream response', () => {
  let getReport
  let h

  beforeEach(() => {
    getReport = jest.fn()
    h = {
      view: jest.fn()
    }
    jest.clearAllMocks()
  })

  test('should call readableStreamReturn when getReport returns a response', async () => {
    const mockResponse = { data: 'test data' }
    getReport.mockResolvedValue(mockResponse)
    readableStreamReturn.mockReturnValue('readable stream result')

    const result = await handleStreamResponse(getReport, 'test-report-name', h)

    expect(getReport).toHaveBeenCalled()
    expect(readableStreamReturn).toHaveBeenCalledWith(mockResponse, h, 'test-report-name')
    expect(result).toBe('readable stream result')
  })

  test('should render the correct view when getReport throws an error', async () => {
    getReport.mockRejectedValue(new Error('Report fetch error'))

    const result = await handleStreamResponse(getReport, 'test-report-name', h)

    expect(getReport).toHaveBeenCalled()
    expect(readableStreamReturn).not.toHaveBeenCalled()
    expect(h.view).toHaveBeenCalledWith('payment-report-unavailable')
    expect(result).toBeUndefined()
  })

  test('should render the correct view when getReport returns null', async () => {
    getReport.mockResolvedValue(null)

    const result = await handleStreamResponse(getReport, 'test-report-name', h)

    expect(getReport).toHaveBeenCalled()
    expect(readableStreamReturn).not.toHaveBeenCalled()
    expect(h.view).toHaveBeenCalledWith('payment-report-unavailable')
    expect(result).toBeUndefined()
  })
})
