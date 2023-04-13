const { v4: uuidv4 } = require('uuid')
const { sendMessage, receiveMessage } = require('../messaging')
const config = require('../config')
const util = require('util')
const { TYPE } = require('../constants/type')

const getData = async (category, value) => {
  const messageId = uuidv4()
  const request = { category, value }
  await sendMessage(request, TYPE, config.messageConfig.dataTopic, { messageId })
  console.info('Data request sent:', util.inspect(request, false, null, true))
  const response = await receiveMessage(messageId, config.messageConfig.dataQueue)
  if (response) {
    console.info('Data response received:', util.inspect(response, false, null, true))
    return response.data
  }
}

module.exports = {
  getData
}
