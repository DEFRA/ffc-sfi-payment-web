/* const { getTrackingData } = require('../../../../app/api')
const { schemeAdmin } = require('../../../../app/auth/permissions')

jest.mock('../../../../app/api')
jest.mock('../../../../app/auth')

let auth
const createServer = require('../../../../app/server')
let server

beforeEach(async () => {
  auth = { strategy: 'session-auth', credentials: { scope: [schemeAdmin] } }
  server = await createServer()
})

afterEach(async () => {
  jest.clearAllMocks()
  await server.stop()
})

describe('AP Listing Report tests', () => {
  const mockApReportData = {
    reportDataId: 8,
    correlationId: '60a12f60-d26b-4f09-912e-10cfcb898fd7',
    frn: '1000000002',
    claimNumber: '00000002',
    agreementNumber: '00000002',
    marketingYear: 2022,
    originalInvoiceNumber: 'SFI00000008',
    invoiceNumber: 'S000000800000002V002',
    currency: 'GBP',
    paymentRequestNumber: 2,
    value: 150000,
    batch: 'SITISFI0002_AP_2022110909115624.dat',
    sourceSystem: 'SFI',
    batchExportDate: '2024-03-18T09:56:34.000Z',
    status: 'Calculation of final state completed',
    lastUpdated: '2024-03-18T09:56:37.000Z',
    revenueOrCapital: null,
    year: 2022,
    routedToRequestEditor: null,
    deltaAmount: 50000,
    apValue: 50000,
    arValue: null,
    debtType: null,
    daxFileName: null,
    daxImported: null,
    settledValue: null,
    phError: null,
    daxError: null
  }

  getTrackingData.mockImplementation(() => {
    return Promise.resolve({
      payload: {
        apReportData: [mockApReportData]
      }
    })
  })

  test('GET /report-list/ap-listing route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/report-list/ap-listing',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /report-list/ap-listing/download route returns 200 with valid query parameters', async () => {
    const options = {
      method: 'GET',
      url: '/report-list/ap-listing/download?start-date-day=01&start-date-month=01&start-date-year=2022&end-date-day=31&end-date-month=12&end-date-year=2022',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /report-list/ap-listing/download route returns 400 with invalid query parameters', async () => {
    const options = {
      method: 'GET',
      url: '/report-list/ap-listing/download?start-date-day=32&start-date-month=13&start-date-year=2022&end-date-day=31&end-date-month=12&end-date-year=2022',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('GET /report-list/ap-listing/download route returns CSV file with valid query parameters', async () => {
    const options = {
      method: 'GET',
      url: '/report-list/ap-listing/download?start-date-day=01&start-date-month=01&start-date-year=2022&end-date-day=31&end-date-month=12&end-date-year=2022',
      auth
    }

    const response = await server.inject(options)
    expect(response.headers['content-type']).toBe('text/csv; charset=utf-8')
    expect(response.headers['content-disposition']).toContain('.csv')
  })
  test('GET /report-list/ap-listing/download route sets endDate to current date if only startDate is provided', async () => {
    const now = new Date()
    const expectedEndDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const options = {
      method: 'GET',
      url: '/report-list/ap-listing/download?start-date-day=01&start-date-month=01&start-date-year=2022',
      auth
    }

    getTrackingData.mockImplementation((url) => {
      const urlObj = new URL(url, 'http://localhost')
      const requestEndDate = urlObj.searchParams.get('endDate')
      expect(requestEndDate).toBe(expectedEndDate)
      return Promise.resolve({
        payload: {
          apReportData: [mockApReportData]
        },
        request: {
          url: urlObj.toString()
        }
      })
    })

    await server.inject(options)
  })

  test('GET /report-list/ap-listing/download route returns error message when fetching tracking data fails', async () => {
    const options = {
      method: 'GET',
      url: '/report-list/ap-listing/download?start-date-day=01&start-date-month=01&start-date-year=2022',
      auth
    }

    getTrackingData.mockImplementation(() => {
      return Promise.reject(new Error('Failed to fetch tracking data'))
    })

    const response = await server.inject(options)
    const viewModel = response.request.response.source.context
    expect(viewModel.errorMessage).toBe('Failed to fetch tracking data')
  })
}) */
