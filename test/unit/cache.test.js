const cache = require('../../app/cache')

describe('Cache', () => {
  const dropMock = jest.fn(() => 'drop')
  const getMock = jest.fn()
  const setMock = jest.fn()

  const serverMock = {
    cache: jest.fn(() => {
      return {
        drop: dropMock,
        get: getMock,
        set: setMock
      }
    })
  }

  const cacheKey = 'cache-key'
  const invalidCacheName = 'invalid-cache'
  const validCacheName = 'payment-journey'

  beforeEach(() => {
    cache.setup(serverMock)
    jest.clearAllMocks()
  })

  describe('clear', () => {
    test('with matching cache name, key is dropped', async () => {
      await cache.clear(validCacheName, cacheKey)

      expect(dropMock).toHaveBeenCalledTimes(1)
      expect(dropMock).toHaveBeenCalledWith(cacheKey)
    })

    test('incorrect cache name throws error', async () => {
      await expect(cache.clear(invalidCacheName, cacheKey)).rejects.toThrow(new Error(`Cache ${invalidCacheName} does not exist`))
    })
  })

  describe('get', () => {
    test('returns value from cache when found', async () => {
      const cacheItem = 'found it'
      getMock.mockResolvedValueOnce(cacheItem)

      const response = await cache.get(validCacheName, cacheKey)

      expect(getMock).toHaveBeenCalledTimes(1)
      expect(getMock).toHaveBeenCalledWith(cacheKey)
      expect(response).toEqual(cacheItem)
    })

    test('returns object when not matching item found in cache', async () => {
      const cacheItem = 'found it'
      getMock.mockResolvedValueOnce(cacheItem)

      const response = await cache.get(validCacheName, cacheKey)

      expect(getMock).toHaveBeenCalledTimes(1)
      expect(getMock).toHaveBeenCalledWith(cacheKey)
      expect(response).toEqual(cacheItem)
    })

    test('incorrect cache name throws error', async () => {
      await expect(cache.get(invalidCacheName, cacheKey)).rejects.toThrow(new Error(`Cache ${invalidCacheName} does not exist`))
    })
  })

  describe('set', () => {
    const value = 'add this'

    test('sets value in cache', async () => {
      await cache.set(validCacheName, cacheKey, value)

      expect(setMock).toHaveBeenCalledTimes(1)
      expect(setMock).toHaveBeenCalledWith(cacheKey, value)
    })

    test('incorrect cache name throws error', async () => {
      await expect(cache.set(invalidCacheName, cacheKey, value)).rejects.toThrow(new Error(`Cache ${invalidCacheName} does not exist`))
    })
  })

  describe('update', () => {
    test('with matching cache name, existing object is merged with new value whilst replacing arrays', async () => {
      const existingValue = { existingKey: 'existingKey', arrayKey: [1, 2, 3] }
      getMock.mockResolvedValueOnce(existingValue)
      const newValue = { newKey: 'newKey', arrayKey: [4, 5, 6] }
      const mergedValue = { ...existingValue, ...newValue }

      const response = await cache.update(validCacheName, cacheKey, newValue)

      expect(getMock).toHaveBeenCalledTimes(1)
      expect(getMock).toHaveBeenCalledWith(cacheKey)
      expect(setMock).toHaveBeenCalledTimes(1)
      expect(setMock).toHaveBeenCalledWith(cacheKey, mergedValue)
      expect(response).toEqual(mergedValue)
    })

    test('with matching cache name, new value is added when non-existant object is attempted to be updated', async () => {
      const newValue = { newKey: 'newKey', arrayKey: [4, 5, 6] }
      const mergedValue = { ...newValue }

      const response = await cache.update(validCacheName, cacheKey, newValue)

      expect(getMock).toHaveBeenCalledTimes(1)
      expect(getMock).toHaveBeenCalledWith(cacheKey)
      expect(setMock).toHaveBeenCalledTimes(1)
      expect(setMock).toHaveBeenCalledWith(cacheKey, mergedValue)
      expect(response).toEqual(mergedValue)
    })

    test('incorrect cache name throws error', async () => {
      await expect(cache.update(invalidCacheName, cacheKey, {})).rejects.toThrow(new Error(`Cache ${invalidCacheName} does not exist`))
    })
  })
})
