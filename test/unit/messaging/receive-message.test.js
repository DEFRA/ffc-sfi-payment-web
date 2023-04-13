const mockAcceptSession = jest.fn()
const mockReceiveMessages = jest.fn()
const mockCompleteMessage = jest.fn()
const mockCloseConnection = jest.fn()

const mockMessageReceiver = jest.fn().mockImplementation(() => {
  return {
    acceptSession: mockAcceptSession,
    receiveMessages: mockReceiveMessages,
    completeMessage: mockCompleteMessage,
    closeConnection: mockCloseConnection
  }
})

jest.mock('ffc-messaging', () => {
  return {
    MessageReceiver: mockMessageReceiver
  }
})

const { MESSAGE_ID } = require('../../mocks/messaging/message-id')
const { RESPONSE_MESSAGE } = require('../../mocks/messaging/message')

const { receiveMessage } = require('../../../app/messaging/receive-message')

let config

describe('receive message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockReceiveMessages.mockReturnValue([RESPONSE_MESSAGE])
    config = {}
  })

  test('should create message receiver from config', async () => {
    await receiveMessage(MESSAGE_ID, config)
    expect(mockMessageReceiver).toHaveBeenCalledWith(config)
  })

  test('should accept session with message id as session id', async () => {
    await receiveMessage(MESSAGE_ID, config)
    expect(mockAcceptSession).toHaveBeenCalledWith(MESSAGE_ID)
  })

  test('should receive messages', async () => {
    await receiveMessage(MESSAGE_ID, config)
    expect(mockReceiveMessages).toHaveBeenCalledWith(1, { maxWaitTimeInMs: 50000 })
  })

  test('should complete message if messages received', async () => {
    await receiveMessage(MESSAGE_ID, config)
    expect(mockCompleteMessage).toHaveBeenCalledWith(RESPONSE_MESSAGE)
  })

  test('should close connection if messages received', async () => {
    await receiveMessage(MESSAGE_ID, config)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })

  test('should return message body if messages received', async () => {
    const result = await receiveMessage(MESSAGE_ID, config)
    expect(result).toEqual(RESPONSE_MESSAGE.body)
  })

  test('should not complete message if no messages received', async () => {
    mockReceiveMessages.mockReturnValue([])
    await receiveMessage(MESSAGE_ID, config)
    expect(mockCompleteMessage).not.toHaveBeenCalled()
  })

  test('should close connection if no messages received', async () => {
    mockReceiveMessages.mockReturnValue([])
    await receiveMessage(MESSAGE_ID, config)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })

  test('should return undefined if no messages received', async () => {
    mockReceiveMessages.mockReturnValue([])
    const result = await receiveMessage(MESSAGE_ID, config)
    expect(result).toBeUndefined()
  })
})
