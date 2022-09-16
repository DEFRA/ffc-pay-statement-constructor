jest.mock('../../../../app/processing/organisation/get-organisation')
const getOrganisation = require('../../../../app/processing/organisation/get-organisation')

jest.mock('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-id')
const getPositiveInvoiceLineByFundingCodeAndPaymentId = require('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-id')

jest.mock('../../../../app/processing/calculation/get-calculation')
const getCalculation = require('../../../../app/processing/calculation/get-calculation')

jest.mock('../../../../app/processing/funding/get-fundings-by-calculation-id')
const getFundingsByCalculationId = require('../../../../app/processing/funding/get-fundings-by-calculation-id')

jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')
const getCompletedPaymentRequestByPaymentRequestId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')

jest.mock('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')
const getSettledSettlementBySettlementId = require('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')

const { getStatement } = require('../../../../app/processing/statement')

let calculation
let paymentRequest
let settlement

describe('get various components and transform to statement object', () => {
  beforeEach(() => {
    const retrievedOrganisationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation').rawOrganisationData))
    const retrievedCalculationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation').rawCalculationData))
    const retrievedFundingsData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings').rawFundingsData))
    const retrievedPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest))
    const retreivedSettlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))

    settlement = {
      invoiceNumber: retreivedSettlement.invoiceNumber,
      paymentRequestId: 1,
      reference: retreivedSettlement.reference,
      settled: retreivedSettlement.settled,
      settlementDate: new Date(retreivedSettlement.settlementDate)

    }

    getSettledSettlementBySettlementId.mockResolvedValue(settlement)

    paymentRequest = {
      paymentRequestId: 1,
      agreementNumber: retrievedPaymentRequest.agreementNumber,
      dueDate: retrievedPaymentRequest.dueDate,
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
    getPositiveInvoiceLineByFundingCodeAndPaymentId.mockResolvedValue(retrievedInvoiceLine)
    getOrganisation.mockResolvedValue(retrievedOrganisationData)
    getCalculation.mockResolvedValue(calculation)
    getFundingsByCalculationId.mockResolvedValue(retrievedFundingsData)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCalculation when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    const statement = await getStatement(paymentRequestId)
    console.log(statement)
    expect(getCalculation).toHaveBeenCalled()
  })
})