const FRN = require('./mock-components/mock-frn')
const { FIVE_HUNDRED_POUNDS } = require('./mock-components/mock-value')
const { GBP } = require('../app/constants/currencies')
const SETTLEMENT_DATE = require('./mock-components/mock-settlement-date')
const { SETTLEMENT_REFERENCE } = require('./mock-components/mock-settlement-reference')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('./mock-components/mock-invoice-number')
const { SOURCE_SYSTEM: SFI_SOURCE_SYSTEM } = require('./mock-components/mock-source-system')
const TRUE = require('./mock-components/mock-settlement-status')

module.exports = {
  sourceSystem: SFI_SOURCE_SYSTEM,
  invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER,
  frn: FRN,
  currency: GBP,
  value: FIVE_HUNDRED_POUNDS,
  settlementDate: SETTLEMENT_DATE,
  reference: SETTLEMENT_REFERENCE,
  settled: TRUE
}
