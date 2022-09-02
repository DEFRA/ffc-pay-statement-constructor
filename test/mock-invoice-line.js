const { ARABLE_SOIL_INTRODUCTORY } = require('../app/constants/funding-codes')
const { SFI_GROSS_VALUE_AP } = require('../app/constants/account-codes')
const { GROSS_VALUE, OVER_DECLARATION_REDUCTION } = require('../app/constants/descriptions')
const { DRD10 } = require('../app/constants/fund-codes')
const { FIVE_HUNDRED_POUNDS, ONE_HUNDRED_POUNDS } = require('./mock-components/mock-value')

const mockInvoiceLineGrossPayment = {
  paymentRequestId: 1,
  fundingCode: ARABLE_SOIL_INTRODUCTORY, // links to fundingOptions
  accountCode: SFI_GROSS_VALUE_AP,
  description: GROSS_VALUE,
  fundCode: DRD10,
  value: FIVE_HUNDRED_POUNDS
}

const mockInvoiceLineReduction = {
  ...mockInvoiceLineGrossPayment,
  description: OVER_DECLARATION_REDUCTION,
  value: ONE_HUNDRED_POUNDS
}

const mockInvoiceLines = [
  mockInvoiceLineGrossPayment,
  mockInvoiceLineReduction,
  mockInvoiceLineReduction,
  { ...mockInvoiceLineGrossPayment, fundingCode: '80002' }
  { ...mockInvoiceLineReduction, fundingCode: '80002' }
]

module.exports = {
  mockInvoiceLineGrossPayment,
  mockInvoiceLineReduction,
  mockInvoiceLines
}
