const { handleCSVResponse } = require('../../../app/helpers/handle-csv-response')
const { fetchDataAndRespond } = require('../../../app/helpers')

jest.mock('../../../app/helpers/handle-csv-response', () => ({
  handleCSVResponse: jest.fn()
}))

describe('fetch data and respond', () => {
  let fetchFn, transformFn, h, filename, emptyView

  beforeEach(() => {
    fetchFn = jest.fn()
    transformFn = jest.fn()
    h = {
      view: jest.fn(),
      response: jest.fn(() => ({
        type: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis()
      }))
    }
    filename = 'test-filename.csv'
    emptyView = 'empty-view'
  })

  test('should call handleCSVResponse with transformed data and filename when data is available', async () => {
    const mockResponse = { payload: [{ id: 1 }] }
    const transformedData = [{ transformedId: 1 }]

    fetchFn.mockResolvedValue(mockResponse)
    transformFn.mockReturnValue(transformedData)
    const mockHandleCSVResponse = jest.fn()
    handleCSVResponse.mockReturnValue(mockHandleCSVResponse)

    await fetchDataAndRespond(fetchFn, transformFn, filename, h, emptyView)

    expect(fetchFn).toHaveBeenCalled()
    expect(transformFn).toHaveBeenCalledWith(mockResponse)
    expect(handleCSVResponse).toHaveBeenCalledWith(transformedData, filename)
    expect(mockHandleCSVResponse).toHaveBeenCalledWith(h)
  })

  test('should render empty view with error message when transformed data is empty', async () => {
    const mockResponse = { payload: [] }
    const transformedData = []

    fetchFn.mockResolvedValue(mockResponse)
    transformFn.mockReturnValue(transformedData)

    await fetchDataAndRespond(fetchFn, transformFn, filename, h, emptyView)

    expect(h.view).toHaveBeenCalledWith(emptyView, { errors: [{ text: 'No data available for the selected filters' }] })
  })

  test('should render payment-report-unavailable view when fetchFn throws an error', async () => {
    fetchFn.mockRejectedValue(new Error('Fetch error'))

    await fetchDataAndRespond(fetchFn, transformFn, filename, h, emptyView)

    expect(h.view).toHaveBeenCalledWith('payment-report-unavailable')
  })

  test('should render payment-report-unavailable view when transformFn throws an error', async () => {
    const mockResponse = { payload: [{ id: 1 }] }

    fetchFn.mockResolvedValue(mockResponse)
    transformFn.mockImplementation(() => { throw new Error('Transform error') })

    await fetchDataAndRespond(fetchFn, transformFn, filename, h, emptyView)

    expect(h.view).toHaveBeenCalledWith('payment-report-unavailable')
  })
})
