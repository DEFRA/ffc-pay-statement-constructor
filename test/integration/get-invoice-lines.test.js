const db = require('../../app/data')

const schemes = require('../../app/constants/schemes')
const mockFundingOptions = {
  fundingCode: '80001',
  name: 'Name: level' // eg Arable and horticulral: introductory
}

const getInvoiceLines = require('../../app/processing/invoice-lines')
const mockPaymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request').processingPaymentRequest))
const mockInvoiceLineGrossPayment = JSON.parse(JSON.stringify(require('../mock-invoice-line').mockInvoiceLineGrossPayment))
const mockInvoiceLineReduction = JSON.parse(JSON.stringify(require('../mock-invoice-line').mockInvoiceLineReduction))
const mockInvoiceLines = JSON.parse(JSON.stringify(require('../mock-invoice-line').mockInvoiceLines))

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
      await db.invoiceLine.bulkCreate(mockInvoiceLines)
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

  test('test', async () => {
    mockPaymentRequest.paymentRequestId = 1
    const result = await getInvoiceLines(mockPaymentRequest.paymentRequestId)
    // expect(result).toHaveLength(3)
  })

  // test('should throw an error when invoiceLine has no description', async () => {
  //   delete mockInvoiceLineGrossPayment.description
  //   await db.invoiceLine.create(mockInvoiceLineGrossPayment)
  //   mockPaymentRequest.paymentRequestId = 1

  //   const wrapper = async () => {
  //     await getInvoiceLines(mockPaymentRequest.paymentRequestId)
  //   }

  //   expect(wrapper).toThrow(new Error())
  // })
})
