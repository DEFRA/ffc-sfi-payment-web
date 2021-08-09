const defaultExpiresIn = 3600 * 1000 // 1 hour

module.exports = {
  defaultExpiresIn,
  paymentSegment: {
    name: 'payment-journey',
    expiresIn: defaultExpiresIn
  },
  redisCatboxOptions: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION ?? 'ffc-sfi-payment-web',
    tls: process.env.NODE_ENV === 'production' ? {} : undefined
  }
}
