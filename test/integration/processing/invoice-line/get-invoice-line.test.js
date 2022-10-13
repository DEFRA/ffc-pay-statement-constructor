const db = require('../../../../app/data')
const schemes = require('../../../../app/constants/schemes')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('../../../mock-components/mock-invoice-number')

const getInvoiceLine = require('../../../../app/processing/invoice-line/get-invoice-line')

const QUARTER = 0.25

let rawInvoiceLinesData

describe('process get invoice line object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    rawInvoiceLinesData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-invoice-line').rawInvoiceLines))
    const rawFundingOption = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-invoice-line').rawFundingOptions))
    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER })
    await db.paymentRequest.bulkCreate(
      [
        {
          paymentRequestId: 1,
          schemeId: 1,
          invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER
        },
        {
          paymentRequestId: 2,
          schemeId: 1,
          invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER
        }
      ]

    )
    await db.fundingOption.bulkCreate(rawFundingOption)
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

  test('should throw error when no existing invoice-line data in database', async () => {
    const fundingOptionCode = '300001'
    const paymentRequestId = 20
    const wrapper = async () => { await getInvoiceLine(fundingOptionCode, paymentRequestId) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when no existing invoice-line data in database that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = '300001'
    const paymentRequestId = 20
    const wrapper = async () => { await getInvoiceLine(fundingOptionCode, paymentRequestId) }

    expect(wrapper).rejects.toThrow()
  })

  test('should return annual value that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.annualValue).toBe(rawInvoiceLinesData[0].value)
  })

  test('should return quarterly value that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyValue).toBe(rawInvoiceLinesData[0].value * QUARTER)
  })

  test('should return quarterly reduction existing invoice line data that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyReduction).toBe(rawInvoiceLinesData[3].value * QUARTER)
  })

  test('should return quarterly payment existing invoice line data that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyPayment).toBe((rawInvoiceLinesData[0].value * QUARTER) - (rawInvoiceLinesData[3].value * QUARTER))
  })

  test('should return reductions item for each reduction that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.reductions).toHaveLength(1)
  })

  test('should return reductions reason without prefix that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.reductions[0].reason).toBe('Over declaration reduction')
  })

  test('should return reductions value that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.reductions[0].value).toBe(rawInvoiceLinesData[3].value)
  })
})
