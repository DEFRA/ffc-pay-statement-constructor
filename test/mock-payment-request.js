const { SFI_GROSS_VALUE_AP } = require('../app/constants/account-codes')
const { GBP } = require('../app/constants/currencies')
const { RP00 } = require('../app/constants/delivery-bodies')
const { GROSS_VALUE } = require('../app/constants/descriptions')
const { DRD10 } = require('../app/constants/fund-codes')
const { ARABLE_SOIL_INTRODUCTORY } = require('../app/constants/funding-codes')
const { AP } = require('../app/constants/ledgers')
const { FIRST_PAYMENT: FIRST_PAYMENT_PAYMENT_REQUEST_NUMBER } = require('../app/constants/payment-request-numbers')
const { QUARTERLY } = require('../app/constants/schedules')
const { SFI: SFI_SCHEME_ID } = require('../app/constants/scheme-ids')
const { SFI: SFI_SOURCE_SYSTEM } = require('../app/constants/source-systems')

const { SFI: AGREEMENT_NUMBER } = require('./mock-components/mock-agreement-number')
const { SFI: CONTRACT_NUMBER } = require('./mock-components/mock-contract-number')
const DUE_DATE = require('./mock-components/mock-due-date')
const FRN = require('./mock-components/mock-frn')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('./mock-components/mock-invoice-number')
const _2022 = require('./mock-components/mock-marketing-year')
const { CORRELATION_ID, REFERENCE_ID } = require('./mock-components/mock-uuidv4')
const { FIVE_HUNDRED_POUNDS } = require('./mock-components/mock-value')

const paymentRequest = {
  agreementNumber: AGREEMENT_NUMBER,
  contractNumber: CONTRACT_NUMBER,
  correlationId: CORRELATION_ID,
  currency: GBP,
  deliveryBody: RP00,
  dueDate: DUE_DATE,
  frn: FRN,
  invoiceLines: [
    {
      accountCode: SFI_GROSS_VALUE_AP,
      description: GROSS_VALUE,
      fundCode: DRD10,
      schemeCode: ARABLE_SOIL_INTRODUCTORY,
      value: FIVE_HUNDRED_POUNDS
    }
  ],
  invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER,
  ledger: AP,
  marketingYear: _2022,
  paymentRequestNumber: FIRST_PAYMENT_PAYMENT_REQUEST_NUMBER,
  schedule: QUARTERLY,
  schemeId: SFI_SCHEME_ID,
  sourceSystem: SFI_SOURCE_SYSTEM,
  value: FIVE_HUNDRED_POUNDS
}

const processingPaymentRequest = { ...paymentRequest }

const submitPaymentRequest = {
  ...processingPaymentRequest,
  completedPaymentRequestId: 1,
  invalid: false,
  invoiceLines: [{
    ...processingPaymentRequest.invoiceLines[0],
    completedInvoiceLineId: 1,
    completedPaymentRequestId: 1
  }],
  paymentRequestId: 1,
  referenceId: REFERENCE_ID
}

module.exports = {
  processingPaymentRequest,
  submitPaymentRequest
}
