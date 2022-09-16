const db = require('../../../../app/data')
const schemes = require('../../../../app/constants/schemes')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('../../../mock-components/mock-invoice-number')

const getPositiveInvoiceLine = require('../../../../app/processing/invoice-line/get-positive-invoice-line')

const QUARTER = 0.25
const MIN_PAYMENT_VALUE = 0
const DEFAULT_REDUCTION_VALUE = 0

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
    const wrapper = async () => { await getPositiveInvoiceLine(fundingOptionCode, paymentRequestId) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when no existing invoice-line data in database that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = '300001'
    const paymentRequestId = 20
    const wrapper = async () => { await getPositiveInvoiceLine(fundingOptionCode, paymentRequestId) }

    expect(wrapper).rejects.toThrow()
  })

  test('should not throw error when there is existing imvoiceline data that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(rawInvoiceLinesData)
    const fundingOptionCode = rawInvoiceLinesData[0].fundingCode
    const paymentRequestId = rawInvoiceLinesData[0].paymentRequestId
    const result = await getPositiveInvoiceLine(fundingOptionCode, paymentRequestId)

    const annualValue = rawInvoiceLinesData[0].value
    const quarterlyValue = annualValue > MIN_PAYMENT_VALUE ? Math.trunc(annualValue * QUARTER) : MIN_PAYMENT_VALUE
    const quarterlyReduction = DEFAULT_REDUCTION_VALUE
    const quarterlyPayment = quarterlyValue - quarterlyReduction
    const reductions = []

    expect(result).toStrictEqual({
      annualValue,
      quarterlyValue,
      quarterlyReduction,
      quarterlyPayment,
      reductions
    })
  })
})
