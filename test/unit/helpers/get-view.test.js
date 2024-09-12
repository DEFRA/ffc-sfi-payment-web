const { getView } = require('../../../app/helpers')
const { getSchemes } = require('../../../app/helpers/get-schemes')

jest.mock('../../../app/helpers/get-schemes')

describe('get view', () => {
  let mockView
  let mockHapi

  beforeEach(() => {
    mockView = jest.fn()
    mockHapi = { view: mockView }
  })

  test('should call getSchemes and h.view with the correct parameters', async () => {
    const schemes = [{ id: 1, name: 'Scheme A' }, { id: 2, name: 'Scheme B' }]
    getSchemes.mockResolvedValue(schemes)

    const path = 'some/path'
    await getView(path, mockHapi)

    expect(getSchemes).toHaveBeenCalledTimes(1)
    expect(mockView).toHaveBeenCalledWith(path, { schemes })
  })

  test('should handle empty schemes array', async () => {
    getSchemes.mockResolvedValue([])

    const path = 'some/empty/path'
    await getView(path, mockHapi)

    expect(mockView).toHaveBeenCalledWith(path, { schemes: [] })
  })

  test('should handle error in getSchemes', async () => {
    getSchemes.mockRejectedValue(new Error('Failed to fetch schemes'))

    const path = 'error/path'

    await expect(getView(path, mockHapi)).rejects.toThrow('Failed to fetch schemes')
    expect(mockView).not.toHaveBeenCalled()
  })
})
