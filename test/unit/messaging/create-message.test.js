const { TYPE } = require('../../../app/constants/type')
const { SOURCE } = require('../../../app/constants/source')

const { BODY } = require('../../mocks/messaging/body')
const { MESSAGE_ID } = require('../../mocks/messaging/message-id')

const { createMessage } = require('../../../app/messaging/create-message')

describe('create message', () => {
  test('should create message with body as body', () => {
    const message = createMessage(BODY, TYPE)
    expect(message.body).toEqual(BODY)
  })

  test('should create message with type as type', () => {
    const message = createMessage(BODY, TYPE)
    expect(message.type).toEqual(TYPE)
  })

  test('should create message with source as source', () => {
    const message = createMessage(BODY, TYPE)
    expect(message.source).toEqual(SOURCE)
  })

  test('should create message with any options set', () => {
    const options = { messageId: MESSAGE_ID }
    const message = createMessage(BODY, TYPE, options)
    expect(message.messageId).toEqual(MESSAGE_ID)
  })
})
