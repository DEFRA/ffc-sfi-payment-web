const wreck = require('@hapi/wreck')
const config = require('./config')

const get = async (url, token) => {
  return wreck.get(`${config.paymentsEndpoint}${url}`, getConfiguration(token))
}

const post = async (url, data, token) => {
  const { payload } = await wreck.post(`${config.paymentsEndpoint}${url}`, {
    payload: data,
    ...getConfiguration(token)
  })
  return payload
}

const getConfiguration = (token) => {
  return {
    headers: {
      Authorization: token ?? ''
    },
    json: true
  }
}

const getTrackingData = async (url, token) => {
  return wreck.get(`${config.trackingEndpoint}${url}`, getConfiguration(token))
}

module.exports = {
  get,
  post,
  getTrackingData
}
