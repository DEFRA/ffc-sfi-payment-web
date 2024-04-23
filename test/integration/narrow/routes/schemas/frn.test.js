const frnSchema = require('../../../../../app/routes/schemas/frn').frn
jest.mock('../../../../../app/auth')

test('should return error when FRN is not 10 digits', () => {
  const data = { frn: 123456789 } // 9 digits

  const { error } = frnSchema.validate(data.frn)

  expect(error.details[0].message).toEqual('The FRN must be 10 digits')
})

test('should not return error when FRN is 10 digits', () => {
  const data = { frn: 1234567890 } // 10 digits

  const { error } = frnSchema.validate(data.frn)

  expect(error).toBeUndefined()
})
