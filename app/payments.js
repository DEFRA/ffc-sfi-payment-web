const { v4: uuidv4 } = require('uuid')
const { sendMessage, receiveMessage } = require('./messaging')
const { messageConfig } = require('./config')
const util = require('util')

const getPaymentsByFrn = async (frn) => {
  return getData('frn', frn)
}

const getPaymentsByCorrelationId = async (correlationId) => {
  return getData('correlationId', correlationId)
}

const getData = async (category, value) => {
  const messageId = uuidv4()
  const request = { category, value }
  await sendMessage(request, 'uk.gov.defra.ffc.pay.data.request', messageConfig.dataTopic, { messageId })
  console.info('Data request sent:', util.inspect(request, false, null, true))
  const response = await receiveMessage(messageId, messageConfig.dataQueue)
  if (response) {
    console.info('Data response received:', util.inspect(response, false, null, true))
    return response
  }
}

module.exports = {
  getPaymentsByFrn,
  getPaymentsByCorrelationId
}
