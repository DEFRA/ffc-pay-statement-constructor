jest.mock('ffc-messaging')
const processProcessingMessage = require('../../../app/messaging/process-processing-message')
let receiver

describe('process payment message', () => {
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
      body: {
        paymentRequest: {}
      }
    }
    await processProcessingMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
