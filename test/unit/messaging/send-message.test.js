const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()

const mockMessageSender = jest.fn().mockImplementation(() => {
  return {
    sendMessage: mockSendMessage,
    closeConnection: mockCloseConnection
  }
})

jest.mock('ffc-messaging', () => {
  return {
    MessageSender: mockMessageSender
  }
})

jest.mock('../../../app/messaging/create-message')
const { createMessage: mockCreateMessage } = require('../../../app/messaging/create-message')

const { TYPE } = require('../../../app/constants/type')

const { MESSAGE_ID } = require('../../mocks/messaging/message-id')
const { BODY } = require('../../mocks/messaging/body')
const { RESPONSE_MESSAGE } = require('../../mocks/messaging/message')

const { sendMessage } = require('../../../app/messaging/send-message')

let options
let config

describe('send message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateMessage.mockReturnValue(RESPONSE_MESSAGE)
    options = { messageId: MESSAGE_ID }
    config = {}
  })

  test('should create message from body, type, config and options', async () => {
    await sendMessage(BODY, TYPE, config, options)
    expect(mockCreateMessage).toHaveBeenCalledWith(BODY, TYPE, options)
  })

  test('should create message sender with config', async () => {
    await sendMessage(BODY, TYPE, config, options)
    expect(mockMessageSender).toHaveBeenCalledWith(config)
  })

  test('should send message', async () => {
    await sendMessage(BODY, TYPE, config, options)
    expect(mockSendMessage).toHaveBeenCalledWith(RESPONSE_MESSAGE)
  })

  test('should close connection', async () => {
    await sendMessage(BODY, TYPE, config, options)
    expect(mockCloseConnection).toHaveBeenCalled()
  })
})
