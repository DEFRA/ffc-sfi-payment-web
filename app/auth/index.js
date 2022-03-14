const config = require('../config').authConfig
const auth = config.enabled ? require('./azure-auth') : require('./dev-auth')

module.exports = { ...auth }
