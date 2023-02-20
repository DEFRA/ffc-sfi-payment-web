const wreck = require('@hapi/wreck')

const get = async (endpoint, url, token) => {
  return wreck.get(`${endpoint}${url}`, getConfiguration(token))
}

const post = async (endpoint, url, data, token) => {
  const { payload } = await wreck.post(`${endpoint}${url}`, {
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

module.exports = {
  get,
  post
}
