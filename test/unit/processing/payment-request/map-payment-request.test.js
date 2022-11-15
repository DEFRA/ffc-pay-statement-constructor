const mapPaymentRequest = require('../../../../app/processing/payment-request/map-payment-request')

let retrievedPaymentRequest
let mappedPaymentRequest

const { NAMES: SCHEDULE_NAMES } = require('../../../../app/constants/schedules')

describe('map required payment request information for building a statement object', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))

    retrievedPaymentRequest = {
      paymentRequestId: 1,
      agreementNumber: paymentRequest.agreementNumber,
      dueDate: paymentRequest.dueDate,
      invoiceNumber: paymentRequest.invoiceNumber,
      marketingYear: paymentRequest.marketingYear,
      value: paymentRequest.value,
      schedule: paymentRequest.schedule,
      originalValue: paymentRequest.value
    }

    mappedPaymentRequest = {
      paymentRequestId: retrievedPaymentRequest.paymentRequestId,
      agreementNumber: retrievedPaymentRequest.agreementNumber,
      dueDate: retrievedPaymentRequest.dueDate,
      frequency: SCHEDULE_NAMES[retrievedPaymentRequest.schedule],
      invoiceNumber: retrievedPaymentRequest.invoiceNumber,
      value: retrievedPaymentRequest.value,
      year: retrievedPaymentRequest.marketingYear,
      schedule: retrievedPaymentRequest.schedule,
      originalValue: retrievedPaymentRequest.originalValue
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return mappedPaymentRequest when a valid paymentRequest is given', async () => {
    const result = await mapPaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual(mappedPaymentRequest)
  })

  test('should return mappedPaymentRequest with default frequency when a paymentRequest with no schedule is given', async () => {
    delete retrievedPaymentRequest.schedule
    const result = await mapPaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual({ ...mappedPaymentRequest, schedule: undefined, frequency: SCHEDULE_NAMES.N0 })
  })

  test('should return mappedPaymentRequest with default frequency when a paymentRequest with an unrecognised schedule is given', async () => {
    retrievedPaymentRequest.schedule = 'NR'
    const result = await mapPaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual({ ...mappedPaymentRequest, schedule: 'NR', frequency: SCHEDULE_NAMES.N0 })
  })

  test('should return undefined object with default frequency when an empty object is given', async () => {
    const undefinedMappedPaymentRequest = Object.keys(mappedPaymentRequest).reduce((o, k) => ({ ...o, [k]: undefined }), {})
    const result = await mapPaymentRequest({})
    expect(result).toStrictEqual({ ...undefinedMappedPaymentRequest, frequency: SCHEDULE_NAMES.N0 })
  })
})
