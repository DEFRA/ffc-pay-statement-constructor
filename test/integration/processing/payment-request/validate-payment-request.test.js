const { DAX_CODES } = require('../../../../app/constants/schedules')

const validatePaymentRequest = require('../../../../app/processing/payment-request/validate-payment-request')

let retrievedPaymentRequest

describe('validate payment request', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    retrievedPaymentRequest = {
      agreementNumber: paymentRequest.agreementNumber,
      dueDate: new Date(paymentRequest.dueDate),
      invoiceNumber: paymentRequest.invoiceNumber,
      marketingYear: paymentRequest.marketingYear,
      paymentRequestId: paymentRequest.paymentRequestId,
      referenceId: paymentRequest.referenceId,
      value: paymentRequest.value,
      schedule: paymentRequest.schedule
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedPaymentRequest', async () => {
    const result = validatePaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual(retrievedPaymentRequest)
  })

  test('should throw when retrievedPaymentRequest is missing required paymentRequestId', async () => {
    delete retrievedPaymentRequest.paymentRequestId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow()
  })

  test('should throw Error when retrievedPaymentRequest is missing required paymentRequestId', async () => {
    delete retrievedPaymentRequest.paymentRequestId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "paymentRequestId" is required" when retrievedPaymentRequest is missing required paymentRequestId', async () => {
    delete retrievedPaymentRequest.paymentRequestId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "paymentRequestId" is required/)
  })

  test('should throw when retrievedPaymentRequest is missing required dueDate', async () => {
    delete retrievedPaymentRequest.dueDate
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow()
  })

  test('should throw Error when retrievedPaymentRequest is missing required dueDate', async () => {
    delete retrievedPaymentRequest.dueDate
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "dueDate" is required" when retrievedPaymentRequest is missing required dueDate', async () => {
    delete retrievedPaymentRequest.dueDate
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "dueDate" is required/)
  })

  test('should throw when retrievedPaymentRequest is missing required marketingYear', async () => {
    delete retrievedPaymentRequest.marketingYear
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow()
  })

  test('should throw Error when retrievedPaymentRequest is missing required marketingYear', async () => {
    delete retrievedPaymentRequest.marketingYear
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "marketingYear" is required" when retrievedPaymentRequest is missing required marketingYear', async () => {
    delete retrievedPaymentRequest.marketingYear
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "marketingYear" is required/)
  })

  test('should throw Error when retrievedPaymentRequest is missing required referenceId', async () => {
    delete retrievedPaymentRequest.referenceId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "referenceId" is required" when retrievedPaymentRequest is missing required referenceId', async () => {
    delete retrievedPaymentRequest.referenceId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "referenceId" is required/)
  })

  test('should not throw when retrievedPaymentRequest is missing optional schedule', async () => {
    delete retrievedPaymentRequest.schedule
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).not.toThrow()
  })

  test('should return retrievedPaymentRequest with default DAX_CODES.QUARTERLY schedule when retrievedPaymentRequest is missing optional schedule', async () => {
    delete retrievedPaymentRequest.schedule

    const result = validatePaymentRequest(retrievedPaymentRequest)

    const defaultSchedulePaymentRequest = { ...retrievedPaymentRequest, schedule: DAX_CODES.QUARTERLY }
    expect(result).toStrictEqual(defaultSchedulePaymentRequest)
  })
})
