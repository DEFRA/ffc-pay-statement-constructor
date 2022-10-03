const mapPaymentRequest = require('../../../../app/processing/payment-request/map-payment-request')

let retreivedPaymentRequest
let mappedPaymentRequest

const { NAMES: SCHEDULE_NAMES } = require('../../../../app/constants/schedules')

describe('map required payment request information for building a statement object', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest))

    retreivedPaymentRequest = {
      paymentRequestId: 1,
      agreementNumber: paymentRequest.agreementNumber,
      dueDate: paymentRequest.dueDate,
      invoiceNumber: paymentRequest.invoiceNumber,
      marketingYear: paymentRequest.marketingYear,
      value: paymentRequest.value,
      schedule: paymentRequest.schedule
    }

    mappedPaymentRequest = {
      paymentRequestId: retreivedPaymentRequest.paymentRequestId,
      agreementNumber: retreivedPaymentRequest.agreementNumber,
      dueDate: retreivedPaymentRequest.dueDate,
      frequency: SCHEDULE_NAMES[retreivedPaymentRequest.schedule],
      invoiceNumber: retreivedPaymentRequest.invoiceNumber,
      value: retreivedPaymentRequest.value,
      year: retreivedPaymentRequest.marketingYear
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return mappedPaymentRequest when a valid paymentRequest is given', async () => {
    const result = await mapPaymentRequest(retreivedPaymentRequest)
    expect(result).toStrictEqual(mappedPaymentRequest)
  })

  test('should return mappedPaymentRequest with default frequency when a paymentRequest with no schedule is given', async () => {
    delete retreivedPaymentRequest.schedule
    const result = await mapPaymentRequest(retreivedPaymentRequest)
    expect(result).toStrictEqual(mappedPaymentRequest)
  })

  test('should return mappedPaymentRequest with default frequency when a paymentRequest with an unrecognised schedule is given', async () => {
    retreivedPaymentRequest.schedule = 'NR'
    const result = await mapPaymentRequest(retreivedPaymentRequest)
    expect(result).toStrictEqual(mappedPaymentRequest)
  })

  test('should return undefined object with default frequency when an empty object is given', async () => {
    const undefinedMappedPaymentRequest = Object.keys(mappedPaymentRequest).reduce((o, k) => ({ ...o, [k]: undefined }), {})
    const result = await mapPaymentRequest({})
    expect(result).toStrictEqual({ ...undefinedMappedPaymentRequest, frequency: SCHEDULE_NAMES.Q4 })
  })
})
