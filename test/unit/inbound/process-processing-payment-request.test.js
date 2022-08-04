jest.mock('../../../app/inbound/process-payment-request')
const processPaymentRequest = require('../../../app/inbound/process-payment-request')

const { processProcessingPaymentRequest } = require('../../../app/inbound')

let paymentRequest

describe('process processing payment request', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-payment-request').processingPaymentRequest))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processPaymentRequest when a valid paymentRequest is given', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(processPaymentRequest).toHaveBeenCalled()
  })

  test('should call processPaymentRequest once when a valid paymentRequest is given', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(processPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call processPaymentRequest with paymentRequest when a valid paymentRequest is given', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(processPaymentRequest).toHaveBeenCalledWith(paymentRequest)
  })

  test('should throw when processPaymentRequest throws', async () => {
    processPaymentRequest.mockRejectedValue(new Error('Payment request processing issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when processPaymentRequest throws Error', async () => {
    processPaymentRequest.mockRejectedValue(new Error('Payment request processing issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Payment request processing issue" when processPaymentRequest throws error with "Payment request processing issue"', async () => {
    processPaymentRequest.mockRejectedValue(new Error('Payment request processing issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Payment request processing issue$/)
  })
})
