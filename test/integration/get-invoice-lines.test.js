const db = require('../../app/data')

const schemes = require('../../app/constants/schemes')
const mockFundingOptions = {
  fundingCode: 'DRD10',
  name: 'funding name'
}
const mockInvoiceLine = {
  paymentRequestId: 1,
  accountCode: 'SOS123',
  description: 'G00 - Gross value of claim',
  fundingCode: 'DRD10',
  fundCode: 'abcd',
  schemeCode: 80001,
  value: 50000
}

const getInvoiceLines = require('../../app/processing/invoice-lines')
const mockPaymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request').processingPaymentRequest))

describe('process payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    // data needed in invoiceLines, paymentRequest, fundingOptions, invoice number, scheme
    try {
      await db.scheme.bulkCreate(schemes)
      await db.invoiceNumber.create({
        invoiceNumber: mockPaymentRequest.invoiceNumber,
        originalInvoiceNumber: mockPaymentRequest.invoiceNumber.slice(0, 5)
      })
      await db.paymentRequest.create(mockPaymentRequest)
      await db.fundingOption.create(mockFundingOptions)
      await db.invoiceLine.create(mockInvoiceLine)
    } catch (err) {
      console.log(err)
    }
  })

  afterEach(async () => {
    // await db.sequelize.truncate({
    //   cascade: true,
    //   restartIdentity: true
    // })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return invoiceLine object', async () => {
    mockPaymentRequest.paymentRequestId = 1
    const result = await getInvoiceLines(mockPaymentRequest.paymentRequestId)
    console.log(result)
    expect(result).toStrictEqual({
      accountCode: 'SOS123',
      description: 'G00 - Gross value of claim',
      fundCode: 'abcd',
      value: 50000
    })
  })
})
