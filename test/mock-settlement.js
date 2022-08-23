const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('./mock-components/mock-invoice-number')

module.exports = {
  sourceSystem: 'SITIAgri',
  invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER,
  frn: 1234567890,
  currency: 'GBP',
  value: 30000,
  settlementDate: 'Fri Jan 21 2022 10:38:44 GMT+0000 (Greenwich Mean Time)',
  reference: 'PY1234567',
  settled: true
}
