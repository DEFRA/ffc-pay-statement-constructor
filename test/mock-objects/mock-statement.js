const convertToPounds = require('../../app/utility/convert-to-pounds')

const { Q4: FREQUENCY_QUARTERLY } = require('../../app/constants/schedules').NAMES
const { SFI: SFI_SHORT_SCHEME_NAME } = require('../../app/constants/scheme-names').SHORT_NAMES
const { SFI: SFI_LONG_SCHEME_NAME } = require('../../app/constants/scheme-names').LONG_NAMES

const DOCUMENT_REFERENCE = require('../mock-components/mock-document-reference')
const { SFI: AGREEMENT_NUMBER } = require('../mock-components/mock-agreement-number')
const { FIVE_HUNDRED_POUNDS } = require('../mock-components/mock-value')
const PERIOD = require('../mock-components/mock-period')

const BUSINESS_NAME = require('../mock-components/mock-organisation-name')
const EMAIL_ADDRESS = require('../mock-components/mock-email-address')
const FRN = require('../mock-components/mock-frn')
const SBI = require('../mock-components/mock-sbi')
const {
  LINE_1,
  LINE_2,
  LINE_3,
  CITY,
  COUNTY,
  POSTCODE
} = require('../mock-components/mock-address')
const { DAY_FORMAT: CALCULATED_DATE } = require('../mock-components/mock-dates').CALCULATED
const { DAY_FORMAT: DUE_DATE } = require('../mock-components/mock-dates').DUE
const { SFI_FIRST_PAYMENT: INVOICE_NUMBER } = require('../mock-components/mock-invoice-number')
// const CALCULATION_REFERENCE = require('../mock-components/mock-calculation-reference')
const { SETTLEMENT_REFERENCE } = require('../mock-components/mock-settlement-reference')
const { DAY_FORMAT: SETTLED_DATE } = require('../mock-components/mock-dates').SETTLEMENT
const _2022 = require('../mock-components/mock-marketing-year')

module.exports = {
  businessName: BUSINESS_NAME,
  documentReference: DOCUMENT_REFERENCE,
  email: EMAIL_ADDRESS,
  frn: Number(FRN),
  sbi: Number(SBI),
  address: {
    line1: LINE_1,
    line2: LINE_2,
    line3: LINE_3,
    line4: CITY,
    line5: COUNTY,
    postcode: POSTCODE
  },
  funding: [
    {
      annualValue: '110.00',
      area: '5.00',
      level: 'Introductory',
      name: 'Arable and horticultural soils',
      quarterlyPayment: '27.50',
      quarterlyReduction: '0.00',
      quarterlyValue: '27.50',
      rate: '22.00',
      reductions: []
    },
    {
      annualValue: '1318.60',
      area: '42.00',
      level: '',
      name: 'Total',
      quarterlyPayment: '342.15',
      quarterlyReduction: '125.00',
      quarterlyValue: '329.65',
      rate: ''
    }
  ],
  payments: [
    {
      calculated: CALCULATED_DATE,
      dueDate: DUE_DATE,
      invoiceNumber: INVOICE_NUMBER,
      period: PERIOD,
      reference: SETTLEMENT_REFERENCE,
      settled: SETTLED_DATE,
      value: convertToPounds(FIVE_HUNDRED_POUNDS)
    }
  ],
  scheme: {
    agreementNumber: AGREEMENT_NUMBER,
    frequency: FREQUENCY_QUARTERLY,
    name: SFI_LONG_SCHEME_NAME,
    shortName: SFI_SHORT_SCHEME_NAME,
    year: String(_2022)
  }
}
