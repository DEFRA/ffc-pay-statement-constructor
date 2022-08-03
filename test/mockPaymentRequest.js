const paymentRequest = {
  agreementNumber: 'SIP000000000001',
  contractNumber: 'SFIP000001',
  correlationId: '9b232ff2-d0bc-4f0a-993b-3754d66b61b1',
  currency: 'GBP',
  deliveryBody: 'RP00',
  dueDate: '01/12/2022',
  frn: '1000000001',
  invoiceLines: [
    {
      accountCode: 'SOS273',
      description: 'G00 - Gross value of claim',
      fundCode: 'DRD10',
      schemeCode: '80001',
      value: 50000
    }
  ],
  invoiceNumber: 'S0000001SFIP000001V001',
  ledger: 'AP',
  marketingYear: 2022,
  paymentRequestNumber: 1,
  schedule: 'Q4',
  schemeId: 1,
  sourceSystem: 'SFI',
  value: 50000
}

const submitPaymentRequest = { ...paymentRequest }

module.exports = {
  paymentRequest,
  submitPaymentRequest
}
