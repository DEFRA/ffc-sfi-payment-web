describe('Format date', () => {
  const formatDate = require('../../app/format-date')

  test('formats date if date format not supplied', () => {
    const result = formatDate('01/11/2021 23:21')
    expect(result).toEqual('01/11/2021')
  })

  test('formats date if date format supplied', () => {
    const result = formatDate('2021/11/01 23:21:20', 'YYYY/MM/DD HH:mm:ss')
    expect(result).toEqual('01/11/2021')
  })

  test('returns Unknown if no date supplied', () => {
    const result = formatDate()
    expect(result).toMatch('Unknown')
  })
})
