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

let statement, type, options, statementTopic

describe('send message', () => {
  beforeEach(() => {
    statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

    const source = 'ffc-pay-statement-constructor'
    const body = { ...statement }
    type = 'uk.gov.pay.statement'
    options = {}

    createMessage.mockReturnValue({
      body,
      type,
      source,
      ...options
    })

    statementTopic = 'ffc-pay-statement'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call createMessage', async () => {
    await sendMessage(statement, type, statementTopic, options)
    expect(createMessage).toHaveBeenCalled()
  })

  test('should call createMessage once', async () => {
    await sendMessage(statement, type, statementTopic, options)
    expect(createMessage).toHaveBeenCalledTimes(1)
  })

  test('should call createMessage with statement, type and options', async () => {
    await sendMessage(statement, type, statementTopic, options)
    expect(createMessage).toHaveBeenCalledWith(statement, type, options)
  })

  test('should call mockSendMessage', async () => {
    await sendMessage(statement, type, statementTopic, options)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('should call mockSendMessage once', async () => {
    await sendMessage(statement, type, statementTopic, options)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })

  test('should call mockSendMessage with message', async () => {
    const message = createMessage()
    await sendMessage(statement, type, statementTopic, options)
    expect(mockSendMessage).toHaveBeenCalledWith(message)
  })

  test('should call mockCloseConnection', async () => {
    await sendMessage(statement, type, statementTopic, options)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should call mockCloseConnection once', async () => {
    await sendMessage(statement, type, statementTopic, options)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })
})
