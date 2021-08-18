const api = require('../api')

const getResponse = async (url) => {
  try {
    return await api.get(`${url}`)
  } catch (err) {
    console.error(`${err}`)
    return undefined
  }
}

const postRequest = async (url, data, token) => {
  try {
    return await api.post(`${url}`, data, token)
  } catch (err) {
    console.error(`${err}`)
    return undefined
  }
}

module.exports = {
  getResponse,
  postRequest
}
