jest.mock('ffc-messaging')
const processReturnMessage = require('../../../app/messaging/process-return-message')
let receiver
let settlement

describe('process return message', () => {
  beforeEach(() => {
    settlement = JSON.parse(JSON.stringify(require('../../mock-settlement')))
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
