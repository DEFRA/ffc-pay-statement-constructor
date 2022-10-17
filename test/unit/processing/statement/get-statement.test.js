jest.mock('../../../../app/processing/organisation/get-organisation')
const getOrganisation = require('../../../../app/processing/organisation/get-organisation')

jest.mock('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-request-id')
const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-request-id')

jest.mock('../../../../app/processing/invoice-line/get-negative-invoice-lines-by-funding-code-and-payment-request-id')
const getNegativeInvoiceLinesByFundingCodeAndPaymentRequestId = require('../../../../app/processing/invoice-line/get-negative-invoice-lines-by-funding-code-and-payment-request-id')

jest.mock('../../../../app/processing/calculation/get-calculation')
const getCalculation = require('../../../../app/processing/calculation/get-calculation')

jest.mock('../../../../app/processing/funding/get-fundings-by-calculation-id')
const getFundingsByCalculationId = require('../../../../app/processing/funding/get-fundings-by-calculation-id')

jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')
const getCompletedPaymentRequestByPaymentRequestId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')

jest.mock('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')
const getSettledSettlementBySettlementId = require('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')

jest.mock('../../../../app/processing/settlement/get-last-settlement')
const getLastSettlement = require('../../../../app/processing/settlement/get-last-settlement')

jest.mock('../../../../app/processing/payment/get-latest-payment')
const getLatestPayment = require('../../../../app/processing/payment/get-latest-payment')

const { getStatement } = require('../../../../app/processing/statement')

let calculation
let paymentRequest
let settlement

let retrievedOrganisationData
let retrievedCalculationData
let retrievedFundingsData
let retrievedPaymentRequest
let retrievedSettlement
let retrievedLatestPayment

describe('get various components and transform to statement object', () => {
  beforeEach(() => {
    retrievedOrganisationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation').rawOrganisationData))
    retrievedCalculationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation').rawCalculationData))
    retrievedFundingsData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings').rawFundingsData))
    retrievedPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest))
    retrievedSettlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
    retrievedLatestPayment = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-latest-payment')))

    settlement = {
      invoiceNumber: retrievedSettlement.invoiceNumber,
      paymentRequestId: 1,
      reference: retrievedSettlement.reference,
      settled: retrievedSettlement.settled,
      settlementDate: new Date(retrievedSettlement.settlementDate),
      value: retrievedSettlement.value
    }

    getSettledSettlementBySettlementId.mockResolvedValue(settlement)

    paymentRequest = {
      paymentRequestId: 1,
      agreementNumber: retrievedPaymentRequest.agreementNumber,
      dueDate: retrievedPaymentRequest.dueDate,
      invoiceNumber: retrievedPaymentRequest.invoiceNumber,
      marketingYear: retrievedPaymentRequest.marketingYear,
      schedule: retrievedPaymentRequest.schedule,
      value: retrievedPaymentRequest.value
    }

    calculation = {
      sbi: retrievedCalculationData.sbi,
      calculated: new Date(retrievedCalculationData.calculationDate),
      invoiceNumber: retrievedCalculationData.invoiceNumber
    }

    const retrievedInvoiceLine = { value: 600 }

    getCompletedPaymentRequestByPaymentRequestId.mockResolvedValue(paymentRequest)
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockResolvedValue(retrievedInvoiceLine)
    getNegativeInvoiceLinesByFundingCodeAndPaymentRequestId.mockResolvedValue([])
    getOrganisation.mockResolvedValue(retrievedOrganisationData)
    getCalculation.mockResolvedValue(calculation)
    getFundingsByCalculationId.mockResolvedValue(retrievedFundingsData)
    getLastSettlement.mockResolvedValue(retrievedSettlement)
    getLatestPayment.mockReturnValue(retrievedLatestPayment)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCalculation when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getStatement(paymentRequestId)
    expect(getCalculation).toHaveBeenCalled()
  })

  test('should call getLastSettlement once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getStatement(paymentRequestId)
    expect(getLastSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call getLatestPayment when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getStatement(paymentRequestId)
    expect(getLatestPayment).toHaveBeenCalledTimes(1)
  })
})
