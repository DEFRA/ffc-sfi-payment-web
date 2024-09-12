const { mapReportData } = require('../../../app/helpers')

describe('map report data', () => {
  test('maps simple fields correctly', () => {
    const data = {
      frn: '1234567890',
      claimNumber: 'CN001',
      year: 2023
    }
    const fields = {
      FRN: 'frn',
      ClaimID: 'claimNumber',
      Year: 'year'
    }

    const result = mapReportData(data, fields)

    expect(result).toEqual({
      FRN: '1234567890',
      ClaimID: 'CN001',
      Year: 2023
    })
  })

  test('maps nested fields correctly', () => {
    const data = {
      claim: {
        id: 'CLM001',
        details: {
          amount: 500,
          status: 'approved'
        }
      }
    }
    const fields = {
      ClaimID: 'claim.id',
      Amount: 'claim.details.amount',
      Status: 'claim.details.status'
    }

    const result = mapReportData(data, fields)

    expect(result).toEqual({
      ClaimID: 'CLM001',
      Amount: 500,
      Status: 'approved'
    })
  })

  test('returns undefined for missing fields', () => {
    const data = {
      claimNumber: 'CN001'
    }
    const fields = {
      FRN: 'frn',
      ClaimID: 'claimNumber'
    }

    const result = mapReportData(data, fields)

    expect(result).toEqual({
      FRN: undefined,
      ClaimID: 'CN001'
    })
  })

  test('handles invalid paths gracefully', () => {
    const data = {
      claim: {
        id: 'CLM001'
      }
    }
    const fields = {
      ClaimID: 'claim.id',
      Amount: 'claim.details.amount' // invalid path
    }

    const result = mapReportData(data, fields)

    expect(result).toEqual({
      ClaimID: 'CLM001',
      Amount: undefined
    })
  })

  test('returns an empty object when fields are empty', () => {
    const data = {
      claimNumber: 'CN001'
    }
    const fields = {}

    const result = mapReportData(data, fields)

    expect(result).toEqual({})
  })

  test('returns an empty object when data is empty', () => {
    const data = {}
    const fields = {
      FRN: 'frn',
      ClaimID: 'claimNumber'
    }

    const result = mapReportData(data, fields)

    expect(result).toEqual({
      FRN: undefined,
      ClaimID: undefined
    })
  })
})
