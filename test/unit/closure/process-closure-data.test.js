const { processClosureData } = require('../../../app/closure')
jest.mock('../../../app/api.js')
const { AGREEMENT_NUMBER } = require('../../mocks/values/agreement-number')
const { FRN } = require('../../mocks/values/frn')

describe('Process closures', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('Should process closures with FRN if data is valid', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},2023-12-04`)
    expect(result.uploadData[0].frn).toBe(FRN.toString())
  })

  test('Should process closures with agreement number if data is valid', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},2023-12-04`)
    expect(result.uploadData[0].agreementNumber).toBe(AGREEMENT_NUMBER)
  })

  test('Should process closures with closure date if data is valid', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},2023-12-04`)
    expect(result.uploadData[0].closureDate).toBe('2023-12-04')
  })

  test('Should process closures with FRN if multiple rows and data is valid', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},2023-12-04\n${FRN + 1},new-agreement-number,2023-05-31`)
    expect(result.uploadData[1].frn).toBe((FRN + 1).toString())
  })

  test('Should process closures with agreement number if multiple rows and data is valid', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},2023-12-04\n${FRN + 1},new-agreement-number,2023-05-31`)
    expect(result.uploadData[1].agreementNumber).toBe('new-agreement-number')
  })

  test('Should process closures with closure date if multiple rows and data is valid', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},2023-12-04\n${FRN + 1},new-agreement-number,2023-05-31`)
    expect(result.uploadData[1].closureDate).toBe('2023-05-31')
  })

  test('Should return appropriate error if row length is less than 3', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER}`)
    expect(result.errors.details[0].message).toBe('The file is not in the expected format')
  })

  test('Should return appropriate error if row length is more than 3', async () => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},2023-12-04,extra-data`)
    expect(result.errors.details[0].message).toBe('The file is not in the expected format')
  })

  test.each([
    { frn: 10000000001, agreementNumber: AGREEMENT_NUMBER, expectedErrorMessage: 'Enter a 10-digit FRN' },
    { frn: 999999998, agreementNumber: AGREEMENT_NUMBER, expectedErrorMessage: 'Enter a 10-digit FRN' },
    { frn: 'not-a-number', agreementNumber: AGREEMENT_NUMBER, expectedErrorMessage: 'Enter a 10-digit FRN' },
    { frn: undefined, agreementNumber: AGREEMENT_NUMBER, expectedErrorMessage: 'Enter a 10-digit FRN' }
  ])('Should return appropriate error if FRN is invalid', async ({ frn, agreementNumber, expectedErrorMessage }) => {
    const result = await processClosureData(`${frn},${agreementNumber},2023-12-04`)
    expect(result.errors.details[0].message).toBe(expectedErrorMessage)
  })

  test('Should return appropriate error if agreement number undefined', async () => {
    const result = await processClosureData(`${FRN},,2023-12-04`)
    expect(result.errors.details[0].message).toBe('Enter a valid agreement number')
  })

  test.each([
    { closureDate: undefined },
    { closureDate: '2-12-04' },
    { closureDate: '2023-87-05' },
    { closureDate: '2023-12-76' }
  ])('Should return appropriate error if date is invalid', async ({ closureDate }) => {
    const result = await processClosureData(`${FRN},${AGREEMENT_NUMBER},${closureDate}`)
    expect(result.errors.details[0].message).toBe('Enter a valid date')
  })
})
