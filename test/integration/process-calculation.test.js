const db = require('../../app/data')

const schemes = require('../../app/constants/schemes')
const fundingOptions = require('../../app/constants/funding-options')

const processCalculation = require('../../app/inbound/calculation')

let calculation
let paymentRequestInProgress
let paymentRequestCompleted

describe('process calculation', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)

    calculation = JSON.parse(JSON.stringify(require('../mock-objects/mock-calculation')))
    paymentRequestInProgress = require('../mock-objects/mock-payment-request').processingPaymentRequest
    paymentRequestCompleted = require('../mock-objects/mock-payment-request').submitPaymentRequest
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

  test('should save entry into calculation where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into calculation where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.count({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into calculation where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into calculation where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.count({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save calculationId as 1 into calculation where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.calculationId).toBe(1)
  })

  test('should save entry into calculation with paymentRequestId as null when no matching paymentRequest record exists where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.paymentRequestId).toBe(null)
  })

  test('should save entry into calculation with paymentRequestId as 1 when matching completed paymentRequest record has paymentRequestId 1 where calculation.invoiceNumber', async () => {
    await db.invoiceNumber.create({ invoiceNumber: paymentRequestCompleted.invoiceNumber, originalInvoiceNumber: paymentRequestCompleted.invoiceNumber.slice(0, 5) })
    await db.paymentRequest.create(paymentRequestCompleted)
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.paymentRequestId).toBe(1)
  })

  test('should save entry into calculation with paymentRequestId as null when no matching completed paymentRequest records where calculation.invoiceNumber', async () => {
    await db.invoiceNumber.create({ invoiceNumber: paymentRequestInProgress.invoiceNumber, originalInvoiceNumber: paymentRequestInProgress.invoiceNumber.slice(0, 5) })
    try { await db.paymentRequest.create(paymentRequestInProgress) } catch (err) { }
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.paymentRequestId).toBe(null)
  })

  test('should save entry into calculation with sbi as calculation.sbi where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.sbi).toBe(calculation.sbi)
  })

  test('should save entry into calculation with calculationDate as calculation.calculationDate where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.calculationDate).toStrictEqual(new Date(calculation.calculationDate))
  })

  test('should save entry into calculation with calculationReference as calculation.calculationReference where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.calculationReference).toBe(calculation.calculationReference)
  })

  test('should save entry into calculation with invoiceNumber as calculation.invoiceNumber where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)
    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.invoiceNumber).toBe(calculation.invoiceNumber)
  })

  test('should save entry into calculation with updated as calculation.updated where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(result.updated).toStrictEqual(new Date(calculation.updated))
  })

  test('should not save calculation.scheme into entry where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(calculation.scheme).toBeDefined()
    expect(result.scheme).toBeUndefined()
  })

  test('should not save calculation.type into entry where calculation.invoiceNumber', async () => {
    await processCalculation(calculation)

    const result = await db.calculation.findOne({ where: { invoiceNumber: calculation.invoiceNumber } })
    expect(calculation.type).toBeDefined()
    expect(result.type).toBeUndefined()
  })

  test('should save entry into funding where calculationId is 1', async () => {
    await processCalculation(calculation)

    const result = await db.funding.findOne({ where: { calculationId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into funding where calculationId is 1 when calculation has 1 funding', async () => {
    calculation.fundings = [calculation.fundings[0]]

    await processCalculation(calculation)

    const result = await db.funding.count({ where: { calculationId: 1 } })
    expect(result).toBe(1)
  })

  test('should save fundingId as 1 into funding where calculationId is 1 when calculation has 1 funding', async () => {
    calculation.fundings = [calculation.fundings[0]]

    await processCalculation(calculation)

    const result = await db.funding.findOne({ where: { calculationId: 1 } })
    expect(result.fundingId).toBe(1)
  })

  test('should save entry into funding with fundingCode as calculation.fundings[0].fundingCode where calculationId is 1 when calculation has 1 funding', async () => {
    calculation.fundings = [calculation.fundings[0]]

    await processCalculation(calculation)

    const result = await db.funding.findOne({ where: { calculationId: 1 } })
    expect(result.fundingCode).toBe(calculation.fundings[0].fundingCode)
  })

  test('should save entry into funding with areaClaimed as calculation.fundings[0].areaClaimed[0] where calculationId is 1 when calculation has 1 funding', async () => {
    calculation.fundings = [calculation.fundings[0]]

    await processCalculation(calculation)

    const result = await db.funding.findOne({ where: { calculationId: 1 } })
    expect(result.areaClaimed).toBe(String(calculation.fundings[0].areaClaimed))
  })

  test('should save calculation.fundings[0].rate into entry where calculationId is 1 when calculation has 1 funding', async () => {
    calculation.fundings = [calculation.fundings[0]]

    await processCalculation(calculation)

    const result = await db.funding.findOne({ where: { calculationId: 1 } })
    expect(calculation.fundings[0].rate).toBeDefined()
    expect(result.rate).toBeDefined()
  })

  test('should save 2 entries into fundings where calculationId is 1 when calculation has 2 fundings', async () => {
    await processCalculation(calculation)

    const result = await db.funding.count({ where: { calculationId: 1 } })
    expect(result).toBe(2)
  })

  test('should save fundingId as 1 and 2 into funding where calculationId is 1 when calculation has 2 fundings', async () => {
    await processCalculation(calculation)

    const result = await db.funding.findAll({ where: { calculationId: 1 } })
    expect(result[0].fundingId).toBe(1)
    expect(result[1].fundingId).toBe(2)
  })

  test('should save entries into funding with fundingCode as calculation.fundings[0].fundingCode where calculationId is 1 when calculation has 2 fundings', async () => {
    await processCalculation(calculation)

    const result = await db.funding.findAll({ where: { calculationId: 1 } })
    expect(result[0].fundingCode).toBe(calculation.fundings[0].fundingCode)
    expect(result[1].fundingCode).toBe(calculation.fundings[0].fundingCode)
  })

  test('should save entries into funding with areaClaimed as calculation.fundings[0].areaClaimed[0] where calculationId is 1 when calculation has 2 fundings', async () => {
    await processCalculation(calculation)

    const result = await db.funding.findAll({ where: { calculationId: 1 } })
    expect(result[0].areaClaimed).toBe(String(calculation.fundings[0].areaClaimed))
    expect(result[1].areaClaimed).toBe(String(calculation.fundings[0].areaClaimed))
  })

  test('should save calculation.fundings[0].rate into entries where calculationId is 1 when calculation has 2 fundings', async () => {
    await processCalculation(calculation)

    const result = await db.funding.findAll({ where: { calculationId: 1 } })
    expect(calculation.fundings[0].rate).toBeDefined()
    expect(result[0].rate).toBeDefined()
    expect(result[1].rate).toBeDefined()
  })
})
