const { processHoldData } = require('../../../app/hold/process-hold-data')
const { FRN } = require('../../mocks/values/frn')
jest.mock('../../../app/api.js')

describe('Process holds data', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('Should process holds with FRN if data is valid', async () => {
    const result = await processHoldData(`${FRN}`)
    expect(result.uploadData[0]).toBe(FRN.toString())
  })

  test('Should process multiple holds if data is valid', async () => {
    const result = await processHoldData(`${FRN},1432157609`)
    expect(result.uploadData[1]).toBe('1432157609')
  })

  test.each([
    { frn: 10000000001 },
    { frn: '0000000001' },
    { frn: 999999998 },
    { frn: 'not-a-number' },
    { frn: undefined }
  ])('Should return appropriate error if any FRN is invalid', async ({ frn }) => {
    const result = await processHoldData(`${frn}`)
    expect(result.errors.details[0].message).toBe('A provided FRN is not in the required format')
  })
})
