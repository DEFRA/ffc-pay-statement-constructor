const db = require('../../../../app/data')

const { getLastSettlement } = require('../../../../app/processing/settlement')
const { SETTLEMENT } = require('../../../mock-components/mock-dates')
let currentSettlement
let previousSettlement

describe('process settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    currentSettlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
    currentSettlement.settlementDate = new Date(SETTLEMENT.DATE)
    previousSettlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
    previousSettlement.settlementDate = new Date(SETTLEMENT.DATE - 1)
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

  test('should return null if no previous settlements', async () => {
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements same date and value', async () => {
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements same date', async () => {
    previousSettlement.settledDate = currentSettlement.settledDate
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements same value and earlier date', async () => {
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements lower value and later date', async () => {
    previousSettlement.settledDate = new Date(SETTLEMENT.DATE + 1)
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements unsettled', async () => {
    previousSettlement.value = 40000
    previousSettlement.settled = false
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return settlement if previous settlements lower value and earlier date', async () => {
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toStrictEqual(previousSettlement)
  })
})
