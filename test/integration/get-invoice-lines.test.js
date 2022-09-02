const db = require('../../app/data')

const schemes = require('../../app/constants/schemes')
const mockFundingOptions = [{
  fundingCode: '80001',
  name: 'Name: level' // eg Arable and horticulral: introductory
},
{
  fundingCode: '80002',
  name: 'Name: level'
}]

const getInvoiceLines = require('../../app/processing/invoice-lines')

const mockPaymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request').processingPaymentRequest))
const mockInvoiceLineGrossPayment = JSON.parse(JSON.stringify(require('../mock-invoice-line').mockInvoiceLineGrossPayment))
const mockInvoiceLineReduction = JSON.parse(JSON.stringify(require('../mock-invoice-line').mockInvoiceLineReduction))
const mockInvoiceLines = JSON.parse(JSON.stringify(require('../mock-invoice-line').mockInvoiceLines))

const mappedInvoiceLine = {
  annualValue: mockInvoiceLineGrossPayment.value,
  fundingCode: mockFundingOptions[0].fundingCode,
  reductions: [{ reason: mockInvoiceLineReduction.description, value: mockInvoiceLineReduction.value }, { reason: mockInvoiceLineReduction.description, value: mockInvoiceLineReduction.value }],
  quarterlyValue: mockInvoiceLineGrossPayment.value / 4,
  quarterlyPayment: (mockInvoiceLineGrossPayment.value - 20000) / 4,
  quarterlyReduction: mockInvoiceLineReduction.value * 2 / 4
}
const mappedInvoiceLines = [
  { ...mappedInvoiceLine },
  { ...mappedInvoiceLine, fundingCode: mockFundingOptions[1].fundingCode }
]

describe('process payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    try {
      await db.scheme.bulkCreate(schemes)
      await db.invoiceNumber.create({
        invoiceNumber: mockPaymentRequest.invoiceNumber,
        originalInvoiceNumber: mockPaymentRequest.invoiceNumber.slice(0, 5)
      })
      await db.paymentRequest.create(mockPaymentRequest)
      await db.fundingOption.bulkCreate(mockFundingOptions)
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

  test('should return mapped invoice line array when valid paymentRequestId given', async () => {
    mockPaymentRequest.paymentRequestId = 1
    const result = await getInvoiceLines(mockPaymentRequest.paymentRequestId)
    expect(result).toStrictEqual(mappedInvoiceLines)
  })

  test('should throw when an invoiceLine has no description', async () => {
    delete mockInvoiceLineGrossPayment.description
    await db.invoiceLine.create(mockInvoiceLineGrossPayment)
    mockPaymentRequest.paymentRequestId = 1

    const wrapper = async () => { await getInvoiceLines(mockPaymentRequest.paymentRequestId) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when an invoiceLine has no accountCode', async () => {
    delete mockInvoiceLineGrossPayment.accountCode
    await db.invoiceLine.create(mockInvoiceLineGrossPayment)
    mockPaymentRequest.paymentRequestId = 1

    const wrapper = async () => { await getInvoiceLines(mockPaymentRequest.paymentRequestId) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when an invoiceLine has no value', async () => {
    delete mockInvoiceLineGrossPayment.value
    await db.invoiceLine.create(mockInvoiceLineGrossPayment)
    mockPaymentRequest.paymentRequestId = 1

    const wrapper = async () => { await getInvoiceLines(mockPaymentRequest.paymentRequestId) }
    expect(wrapper).rejects.toThrow()
  })
})
