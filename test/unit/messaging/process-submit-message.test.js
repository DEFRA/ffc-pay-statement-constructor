jest.mock('ffc-messaging')
const processSubmitMessage = require('../../../app/messaging/process-submit-message')
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
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
