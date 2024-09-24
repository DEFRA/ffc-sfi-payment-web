const { buildQueryUrl } = require('../../../app/helpers/build-query-url')

describe('build query URL', () => {
  test('should build URL with mandatory parameters', () => {
    const path = '/endpoint'
    const schemeId = '123'
    const year = '2024'
    const result = buildQueryUrl(path, schemeId, year)
    expect(result).toBe('/endpoint?schemeId=123&year=2024')
  })

  test('should include frn if it is not empty', () => {
    const path = '/endpoint'
    const schemeId = '123'
    const year = '2024'
    const frn = '456789'
    const result = buildQueryUrl(path, schemeId, year, undefined, frn)
    expect(result).toBe('/endpoint?schemeId=123&year=2024&frn=456789')
  })

  test('should not include frn if it is undefined', () => {
    const path = '/endpoint'
    const schemeId = '123'
    const year = '2024'
    const result = buildQueryUrl(path, schemeId, year, undefined, undefined)
    expect(result).toBe('/endpoint?schemeId=123&year=2024')
  })

  test('should include revenueOrCapital if it is not empty or just whitespace', () => {
    const path = '/endpoint'
    const schemeId = '123'
    const year = '2024'
    const frn = '456789'
    const revenueOrCapital = 'Revenue'
    const result = buildQueryUrl(path, schemeId, year, undefined, frn, revenueOrCapital)
    expect(result).toBe('/endpoint?schemeId=123&year=2024&frn=456789&revenueOrCapital=Revenue')
  })

  test('should not include revenueOrCapital if it is empty or just whitespace', () => {
    const path = '/endpoint'
    const schemeId = '123'
    const year = '2024'
    const frn = '456789'
    const revenueOrCapital = '   ' // Just whitespace
    const result = buildQueryUrl(path, schemeId, year, undefined, frn, revenueOrCapital)
    expect(result).toBe('/endpoint?schemeId=123&year=2024&frn=456789')
  })

  test('should handle missing optional parameters gracefully', () => {
    const path = '/endpoint'
    const schemeId = '123'
    const year = '2024'
    const result = buildQueryUrl(path, schemeId, year, undefined, undefined, undefined)
    expect(result).toBe('/endpoint?schemeId=123&year=2024')
  })

  test('should handle all parameters being present', () => {
    const path = '/endpoint'
    const schemeId = '123'
    const year = '2024'
    const prn = 1
    const frn = '456789'
    const revenueOrCapital = 'Capital'
    const result = buildQueryUrl(path, schemeId, year, prn, frn, revenueOrCapital)
    expect(result).toBe('/endpoint?schemeId=123&year=2024&prn=1&frn=456789&revenueOrCapital=Capital')
  })
})
