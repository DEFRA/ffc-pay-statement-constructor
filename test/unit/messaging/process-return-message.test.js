jest.mock('ffc-messaging')
const processReturnMessage = require('../../../app/messaging/process-return-message')
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
        invoiceNumber: '12345'
      }
    }
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
