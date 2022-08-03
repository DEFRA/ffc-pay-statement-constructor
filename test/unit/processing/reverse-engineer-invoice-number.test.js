const reverseEngineerInvoiceNumber = require('../../../app/processing/reverse-engineer-invoice-number')

let paymentRequest

describe('reverse engineer original invoice number from processed invoice number', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../mockPaymentRequest').paymentRequest))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return "originalS0000" plus the first 5 characters of the invoice number when an invoice number with more than 5 characters is given', async () => {
    const invoiceNumber = paymentRequest.invoiceNumber
    const result = await reverseEngineerInvoiceNumber(invoiceNumber)
    expect(result).toBe('originalS0000')
  })

  test('should return "originalS0000" plus the 5 characters of the invoice number when an invoice number with 5 characters is given', async () => {
    const invoiceNumber = paymentRequest.invoiceNumber.slice(0, 5)
    const result = await reverseEngineerInvoiceNumber(invoiceNumber)
    expect(result).toBe('originalS0000')
  })

  test('should return "originalS00" plus the 3 characters of the invoice number when an invoice number with fewer than 5 characters is given', async () => {
    const invoiceNumber = paymentRequest.invoiceNumber.slice(0, 3)
    const result = await reverseEngineerInvoiceNumber(invoiceNumber)
    expect(result).toBe('originalS00')
  })
})
