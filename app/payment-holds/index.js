const api = require('../api')

const getPaymentHoldResponse = async (url) => {
  try {
    return await api.get(`${url}`)
  } catch (err) {
    console.error(`${err}`)
    return undefined
  }
}

const getPaymentHoldCategoriesResponse = async (url) => {
  try {
    return await api.get(`${url}`)
  } catch (err) {
    console.error(`${err}`)
    return undefined
  }
}

const getPaymentHoldFRNsResponse = async (url) => {
  try {
    return await api.get(`${url}`)
  } catch (err) {
    console.error(`${err}`)
    return undefined
  }
}

const addPaymentHoldRequest = async (url) => {
  try {
    return await api.post(`${url}`)
  } catch (err) {
    console.error(`${err}`)
    return undefined
  }
}

const removePaymentHoldRequest = async (url) => {
  try {
    return await api.post(`${url}`)
  } catch (err) {
    console.error(`${err}`)
    return undefined
  }
}

module.exports = {
  getPaymentHoldResponse,
  getPaymentHoldCategoriesResponse,
  getPaymentHoldFRNsResponse,
  addPaymentHoldRequest,
  removePaymentHoldRequest
}
