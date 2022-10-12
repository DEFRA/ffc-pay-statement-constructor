const db = require('../../../../app/data')

const { getLastSettlement } = require('../../../../app/processing/settlement')
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
    previousSettlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
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
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements same value and earlier date', async () => {
    previousSettlement.settledDate = 'Tue Feb 07 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements lower value and later date', async () => {
    previousSettlement.settledDate = 'Tue Feb 09 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toBeNull()
  })

  test('should return settlement if previous settlements lower value and earlier date', async () => {
    previousSettlement.settledDate = 'Tue Feb 07 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(currentSettlement)
    expect(lastSettlement).toStrictEqual(previousSettlement)
  })
})
