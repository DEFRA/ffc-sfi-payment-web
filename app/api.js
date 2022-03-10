const wreck = require('@hapi/wreck')
const config = require('./config')

async function get (url, token) {
  return wreck.get(`${config.paymentsEndpoint}${url}`, getConfiguration(token))
}

async function post (url, data, token) {
  const { payload } = await wreck.post(`${config.paymentsEndpoint}${url}`, {
    payload: data,
    ...getConfiguration(token)
  })
  return payload
}

function getConfiguration (token) {
  return {
    headers: {
      Authorization: token ?? ''
    },
    json: true
  }
}

module.exports = {
  get,
  post
}
