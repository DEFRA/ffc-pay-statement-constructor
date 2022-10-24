const { SFI } = require('../../app/constants/scheme-names').SHORT_NAMES
const { CALCULATION: CALCULATION_TYPE } = require('../../app/constants/types')

const CALCULATION_REFERENCE = require('../mock-components/mock-calculation-reference')
const { DATE: CALCULATION_DATE } = require('../mock-components/mock-dates').CALCULATED
const FUNDINGS = require('../mock-components/mock-fundings')
const SBI = require('../mock-components/mock-sbi')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('../mock-components/mock-invoice-number')
const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED

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
