const paymentRequest = {
  sourceSystem: 'SFIP',
  deliveryBody: 'RP00',
  invoiceNumber: 'S0000001SFIP000001V001',
  frn: '1000000001',
  marketingYear: 2022,
  paymentRequestNumber: 1,
  agreementNumber: 'SIP000000000001',
  contractNumber: 'SFIP000001',
  currency: 'GBP',
  schedule: 'Q4',
  dueDate: '01/12/2022',
  value: 50000,
  correlationId: '9b232ff2-d0bc-4f0a-993b-3754d66b61b1',
  invoiceLines: [
    {
      schemeCode: '80001',
      accountCode: 'SOS273',
      fundCode: 'DRD10',
      description: 'G00 - Gross value of claim',
      value: 50000
    }
  ],
  schemeId: 1,
  ledger: 'AP'
}

const submitPaymentRequest = { ...paymentRequest }

module.exports = {
  paymentRequest,
  submitPaymentRequest
}
