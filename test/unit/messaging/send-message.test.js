
const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()

jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: mockCloseConnection
      }
    })
  }
})

jest.mock('../../../app/messaging/create-message')
const createMessage = require('../../../app/messaging/create-message')

const sendMessage = require('../../../app/messaging/send-message')

const mockStatement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))
const config = require('../../../app/config')
let options, type

describe('send message', () => {
  beforeEach(() => {
    const source = 'ffc-pay-statement-constructor'
    const body = { ...mockStatement }
    type = 'uk.gov.pay.statement'
    options = {}

    createMessage.mockReturnValue({
      body,
      type,
      source,
      ...options
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call createMessage', async () => {
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(createMessage).toHaveBeenCalled()
  })

  test('should call createMessage once', async () => {
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(createMessage).toHaveBeenCalledTimes(1)
  })

  test('should call createMessage with mockStatement, type and options', async () => {
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(createMessage).toHaveBeenCalledWith(mockStatement, type, options)
  })

  test('should call mockSendMessage', async () => {
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('should call mockSendMessage once', async () => {
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })

  test('should call mockSendMessage with message', async () => {
    const message = createMessage()
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(mockSendMessage).toHaveBeenCalledWith(message)
  })

  test('should call mockCloseConnection', async () => {
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should call mockCloseConnection once', async () => {
    await sendMessage(mockStatement, type, config.statementTopic, options)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })
})
