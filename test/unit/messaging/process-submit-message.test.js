jest.mock('ffc-messaging')

<<<<<<< HEAD
jest.mock('../../../app/inbound/process-submit-payment-request')
const processPaymentRequest = require('../../../app/inbound/process-submit-payment-request')
=======
jest.mock('../../../app/inbound')
const { processSubmitPaymentRequest } = require('../../../app/inbound')
>>>>>>> 6cf9c6aba539539c629d6bf97dbfb326575f5d5f

const processSubmitMessage = require('../../../app/messaging/process-submit-message')

let receiver
let paymentRequest
let message

describe('process submit message', () => {
  beforeEach(() => {
    processSubmitPaymentRequest.mockReturnValue(undefined)

    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-payment-request').submitPaymentRequest))

    receiver = {
      completeMessage: jest.fn()
    }

    message = { body: paymentRequest }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processSubmitPaymentRequest when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processSubmitPaymentRequest).toHaveBeenCalled()
  })

  test('should call processSubmitPaymentRequest once when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processSubmitPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call processSubmitPaymentRequest with paymentRequest when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processSubmitPaymentRequest).toHaveBeenCalledWith(paymentRequest)
  })

  test('should not throw when processSubmitPaymentRequest throws', async () => {
    processSubmitPaymentRequest.mockRejectedValue(new Error('Database save issue'))

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

  test('should not call receiver.completeMessage when processSubmitPaymentRequest throws', async () => {
    processSubmitPaymentRequest.mockRejectedValue(new Error('Transaction failed'))
    try { await processSubmitMessage(message, receiver) } catch {}
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should not throw when processSubmitPaymentRequest throws', async () => {
    processSubmitPaymentRequest.mockRejectedValue(new Error('Transaction failed'))

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
