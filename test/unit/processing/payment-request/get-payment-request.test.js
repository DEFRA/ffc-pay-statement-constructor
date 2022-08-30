jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')
const getCompletedPaymentRequestByPaymentRequestId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')


jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')
const getCompletedPaymentRequestByPaymentRequestId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')

jest.mock('../../../../app/processing/payment-request/map-payment-request')
// const mapPaymentRequest = require('../../../../app/processing/payment-request/map-payment-request')

const getPaymentRequest = require('../../../../app/processing/payment-request/get-payment-request')

let paymentRequest

describe('get and map required payment request information for building a statement object', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest))

    getCompletedPaymentRequestByPaymentRequestId.mockResolvedValue(null)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = paymentRequest.paymentRequestId
    await getPaymentRequest(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId once when a paymentRequestId is given', async () => {
    const paymentRequestId = paymentRequest.paymentRequestId
    await getPaymentRequest(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalledTimes(1)
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId with paymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = paymentRequest.paymentRequestId
    await getPaymentRequest(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalledWith(paymentRequestId)
  })
})
