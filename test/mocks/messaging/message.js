const { SOURCE } = require('../../../app/constants/source')
const { TYPE } = require('../../../app/constants/type')
const { REQUEST } = require('../request')
const { BODY } = require('./body')
const { SESSION_ID } = require('./message-id')

module.exports = {
  REQUEST_MESSAGE: {
    body: REQUEST
  },
  RESPONSE_MESSAGE: {
    body: BODY,
    type: TYPE,
    source: SOURCE,
    sessionId: SESSION_ID
  }
}
