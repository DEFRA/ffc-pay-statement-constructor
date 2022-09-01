const db = require('../../app/data')

const schemes = require('../../app/constants/schemes')
const mockFundingOptions = {
  fundingCode: '80001',
  name: 'Name: level' // eg Arable and horticulral: introductory
}

const getInvoiceLines = require('../../app/processing/invoice-lines')
const mockPaymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request').processingPaymentRequest))
const mockInvoiceLine = JSON.parse(JSON.stringify(require('../mock-invoice-line').mockInvoiceLine))

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
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return invoiceLine object', async () => {
    mockPaymentRequest.paymentRequestId = 1
    const result = await getInvoiceLines(mockPaymentRequest.paymentRequestId)
    console.log(result)
    expect(result).toStrictEqual([{
      accountCode: mockInvoiceLine.accountCode,
      description: mockInvoiceLine.description,
      fundCode: mockInvoiceLine.fundCode,
      value: mockInvoiceLine.value
    }])
  })
})
