const { ARABLE_SOIL_INTRODUCTORY } = require('../app/constants/funding-codes')
const { SFI_GROSS_VALUE_AP } = require('../app/constants/account-codes')
const { GROSS_VALUE } = require('../app/constants/descriptions')
const { DRD10 } = require('../app/constants/fund-codes')
const { FIVE_HUNDRED_POUNDS } = require('./mock-components/mock-value')

const mockInvoiceLine = {
  paymentRequestId: 1,
  fundingCode: ARABLE_SOIL_INTRODUCTORY, // links to fundingOptions
  accountCode: SFI_GROSS_VALUE_AP,
  description: GROSS_VALUE,
  fundCode: DRD10,
  value: FIVE_HUNDRED_POUNDS
}

module.exports = {
  mockInvoiceLine
}
