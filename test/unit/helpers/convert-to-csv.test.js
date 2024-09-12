const convertToCSV = require('../../../app/helpers/convert-to-csv')

describe('convert array data to CSV', () => {
  test('should correctly convert array of objects to CSV string', () => {
    const data = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 }
    ]
    const result = convertToCSV(data)
    expect(result).toBe('"name","age"\n"John","30"\n"Jane","25"')
  })

  test('should handle an empty array', () => {
    const data = []
    expect(() => convertToCSV(data)).toThrow('Cannot convert undefined or null to object')
  })

  test('should handle a single object in the array', () => {
    const data = [{ name: 'John', age: 30 }]
    const result = convertToCSV(data)
    expect(result).toBe('"name","age"\n"John","30"')
  })
})
