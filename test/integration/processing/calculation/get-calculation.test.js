const db = require('../../../../app/data')
const schemes = require('../../../../app/constants/schemes')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('../../../mock-components/mock-invoice-number')

const getCalculation = require('../../../../app/processing/calculation')

let rawCalculationData
let paymentRequest

describe('process get calculation object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    rawCalculationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation').rawCalculationData))

    await db.scheme.bulkCreate(schemes)
    await db.organisation.create({ sbi: rawCalculationData.sbi })
    await db.invoiceNumber.create({ invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER })
    paymentRequest = {
      paymentRequestId: rawCalculationData.paymentRequestId,
      schemeId: 1,
      invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER
    }
    await db.paymentRequest.create(paymentRequest)
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

  test('should throw error when no existing calculation data', async () => {
    const wrapper = async () => { await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber) }

    expect(wrapper).rejects.toThrow()
  })

  test('should not throw error when there is existing calculation data with sbi, calculationId, invoiceNumber, calculationDate and paymentRequestId', async () => {
    await db.calculation.create(rawCalculationData)

    const result = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber)

    expect(result).toStrictEqual({
      calculationId: rawCalculationData.calculationId,
      sbi: rawCalculationData.sbi,
      calculated: new Date(rawCalculationData.calculationDate),
      invoiceNumber: rawCalculationData.invoiceNumber,
      paymentRequestId: rawCalculationData.paymentRequestId
    })
  })

  test('should throw error when there is existing calculation data with sbi but no calculationDate', async () => {
    rawCalculationData.calculationDate = null
    await db.calculation.create(rawCalculationData)

    const wrapper = async () => { await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when there is existing calculation data with calculationDate but no sbi', async () => {
    rawCalculationData.calculationDate = null
    await db.calculation.create(rawCalculationData)

    const wrapper = async () => { await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber) }

    expect(wrapper).rejects.toThrow()
  })
})
