jest.mock('ffc-messaging')

jest.mock('../../../app/inbound')
const processPaymentRequest = require('../../../app/inbound')

const processSubmitMessage = require('../../../app/messaging/process-submit-message')

let receiver
let paymentRequest
let message

describe('process submit message', () => {
  beforeEach(() => {
    processPaymentRequest.mockReturnValue(undefined)

    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-payment-request').submitPaymentRequest))

    receiver = {
      completeMessage: jest.fn()
    }

    message = { body: { paymentRequest } }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processPaymentRequest when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processPaymentRequest).toHaveBeenCalled()
  })

  test('should call processPaymentRequest once when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call processPaymentRequest with paymentRequest when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processPaymentRequest).toHaveBeenCalledWith({ paymentRequest })
  })

  test('should not throw when processPaymentRequest throws', async () => {
    processPaymentRequest.mockRejectedValue(new Error('Database save issue'))

    const wrapper = async () => {
      await processSubmitMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call receiver.completeMessage when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should call receiver.completeMessage once when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledTimes(1)
  })

  test('should call receiver.completeMessage with message when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should not throw when processPaymentRequest throws', async () => {
    processPaymentRequest.mockRejectedValue(new Error('Transaction failed'))

    const wrapper = async () => {
      await processSubmitMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when receiver.completeMessage throws', async () => {
    receiver.completeMessage.mockRejectedValue(new Error('Azure difficulties'))

    const wrapper = async () => {
      await processSubmitMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })
})
