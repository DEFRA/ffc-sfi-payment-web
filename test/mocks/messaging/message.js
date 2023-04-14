const { REQUEST } = require('../request')
const { BODY } = require('./body')
const { TYPE } = require('../../../app/constants/type')
const { SOURCE } = require('../../../app/constants/source')
const { MESSAGE_ID } = require('./message-id')

module.exports = {
  REQUEST_MESSAGE: {
    body: REQUEST
  },
  RESPONSE_MESSAGE: {
    body: BODY,
    type: TYPE,
    source: SOURCE,
    sessionId: MESSAGE_ID
  }
}
