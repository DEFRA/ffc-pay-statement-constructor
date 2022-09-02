const { SFI } = require('../app/constants/scheme-names')
const { CALCULATION: CALCULATION_TYPE } = require('../app/constants/types')

const CALCULATION_REFERENCE = require('./mock-components/mock-calculation-reference')
const { RECEIVED: CALCULATION_DATE } = require('./mock-components/mock-timestamps')
const FUNDINGS = require('./mock-components/mock-fundings')
const SBI = require('./mock-components/mock-sbi')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('./mock-components/mock-invoice-number')
const { UPDATED: UPDATED_TIMESTAMP } = require('./mock-components/mock-timestamps')

module.exports = {
  calculationDate: CALCULATION_DATE,
  calculationReference: CALCULATION_REFERENCE,
  fundings: FUNDINGS,
  invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER,
  sbi: SBI,
  scheme: SFI,
  type: CALCULATION_TYPE,
  updated: UPDATED_TIMESTAMP
}
