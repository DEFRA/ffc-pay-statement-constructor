const db = require('../../../../app/data')

const { getLastSettlement } = require('../../../../app/processing/settlement')
let settlement

describe('process settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    settlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
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
    const lastSettlement = await getLastSettlement(settlement)
    expect(lastSettlement).toBeNull()
  })
})
