jest.mock('ffc-messaging')
const processReturnMessage = require('../../../app/messaging/process-return-message')
const settlement = JSON.parse(JSON.stringify(require('../../mock-settlement')))
let receiver

describe('process return message', () => {
  beforeEach(() => {
    receiver = {
      completeMessage: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('completes message', async () => {
    const message = {
      body: { ...settlement }
    }
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
