const hoek = require('@hapi/hoek')
const config = require('../config').cacheConfig
let paymentJourneyCache

const setup = (server) => {
  paymentJourneyCache = server.cache({
    expiresIn: config.paymentSegment.expiresIn,
    segment: config.paymentSegment.name
  })
}

const get = async (cacheName, key) => {
  const cache = getCache(cacheName)
  const object = await cache.get(key)
  return object ?? {}
}

const set = async (cacheName, key, value) => {
  const cache = getCache(cacheName)
  await cache.set(key, value)
}

const update = async (cacheName, key, object) => {
  const existing = await get(cacheName, key)
  hoek.merge(existing, object, { mergeArrays: false })
  await set(cacheName, key, existing)
  return existing
}

const clear = async (cacheName, key) => {
  const cache = getCache(cacheName)
  await cache.drop(key)
}

const getCache = (cacheName) => {
  if (cacheName === 'payment-journey') {
    return paymentJourneyCache
  } else {
    throw new Error(`Cache ${cacheName} does not exist`)
  }
}

module.exports = {
  setup,
  get,
  set,
  update,
  clear
}
