const sendMessage = require('../../../../app/messaging/send-message')
jest.mock('../../../../app/messaging/send-message')

const mockStatement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
const type = 'uk.gov.pay.statement'
const config = require('../../../../app/config')

const publishStatement = require('../../../../app/processing/statement/publish-statement')

describe('publish statement', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call sendMessage', async () => {
    await publishStatement(mockStatement)
    expect(sendMessage).toHaveBeenCalled()
  })

  test('should call sendMessage once', async () => {
    await publishStatement(mockStatement)
    expect(sendMessage).toHaveBeenCalledTimes(1)
  })

  test('should call sendMessage with mockStatement, type and config.statementTopic', async () => {
    await publishStatement(mockStatement)
    expect(sendMessage).toHaveBeenCalledWith(mockStatement, type, config.statementTopic)
  })
})
