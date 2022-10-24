const db = require('../../../../app/data')

const { getSettlement } = require('../../../../app/processing/settlement')

const schemes = require('../../../../app/constants/schemes')
const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))

const SETTLEMENT_ID_NOT_SETTLED = 1
const SETTLEMENT_ID_SETTLED = 2

let settlement
let mappedSettlement

describe('process settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({
      invoiceNumber: paymentRequest.invoiceNumber,
      originalInvoiceNumber: paymentRequest.invoiceNumber.slice(0, 5)
    })

    await db.paymentRequest.create(paymentRequest)

    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    await db.settlement.create({ ...settlement, paymentRequestId: 1, settled: false })

    mappedSettlement = {
      invoiceNumber: settlement.invoiceNumber,
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled,
      settlementDate: new Date(settlement.settlementDate),
      value: settlement.value
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

  test('should return mapped settled object when existing settled settlement with required information exists', async () => {
    try { await db.settlement.create({ ...settlement, paymentRequestId: 1 }) } catch { }
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result).toStrictEqual(mappedSettlement)
  })

  test('should throw when no existing settlement exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getSettlement(1) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing settlement exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getSettlement(undefined) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing settlement exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getSettlement(null) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing unsettled settlement with required information exists', async () => {
    const wrapper = async () => { await getSettlement(SETTLEMENT_ID_NOT_SETTLED) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing settled settlement with missing required reference does not exist', async () => {
    delete settlement.reference
    await db.settlement.create({ ...settlement, paymentRequestId: 1 })

    const wrapper = async () => { await getSettlement(SETTLEMENT_ID_SETTLED) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing settled settlement with missing required settled does not exist', async () => {
    delete settlement.settled
    await db.settlement.create({ ...settlement, paymentRequestId: 1 })

    const wrapper = async () => { await getSettlement(SETTLEMENT_ID_SETTLED) }

    expect(wrapper).rejects.toThrow()
  })
})
