jest.mock('../../../../app/processing/calculation/get-calculation')
const getCalculation = require('../../../../app/processing/calculation/get-calculation')

jest.mock('../../../../app/processing/payment-request/get-in-progress-payment-request-from-completed')
const getInProgressPaymentRequestFromCompleted = require('../../../../app/processing/payment-request/get-in-progress-payment-request-from-completed')

jest.mock('../../../../app/processing/components')
const {
  getAddress,
  getDetails,
  getScheme
} = require('../../../../app/processing/components')

const { getPaymentSchedule } = require('../../../../app/processing/payment-schedule')

describe('get various components and transform to payment schedule object', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    const calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    const mappedCalculation = {
      calculationId: 1,
      paymentRequestId: 1,
      calculated: calculation.calculationDate,
      invoiceNumber: calculation.invoiceNumber,
      sbi: calculation.sbi
    }

    const details = {
      businessName: organisation.businessName,
      email: organisation.email,
      frn: Number(organisation.frn),
      sbi: Number(organisation.sbi)
    }

    const address = {
      line1: organisation.line1,
      line2: organisation.line2,
      line3: organisation.line3,
      line4: organisation.line4,
      line5: organisation.line5,
      postcode: organisation.postcode
    }

    const scheme = {
      name: 'Sustainable Farming Incentive',
      shortName: 'SFI',
      year: String(paymentRequest.year),
      frequency: paymentRequest.frequency,
      agreementNumber: paymentRequest.agreementNumber
    }

    getInProgressPaymentRequestFromCompleted.mockResolvedValue(paymentRequest)
    getCalculation.mockResolvedValue(mappedCalculation)
    getDetails.mockResolvedValue(details)
    getAddress.mockResolvedValue(address)
    getScheme.mockResolvedValue(scheme)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getInProgressPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getInProgressPaymentRequestFromCompleted).toHaveBeenCalled()
  })

  test('should call getCalculation when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getCalculation).toHaveBeenCalled()
  })

  test('should call getDetails when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getDetails).toHaveBeenCalled()
  })

  test('should call getAddress when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getAddress).toHaveBeenCalled()
  })

  test('should call getScheme when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getScheme).toHaveBeenCalled()
  })
})
