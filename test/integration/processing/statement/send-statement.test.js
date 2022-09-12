const db = require('../../../../app/data')

const sendStatement = require('../../../../app/processing/statement')
const scheduleId = 1
const statement = JSON.parse(JSON.stringify(require('../../../mock-statement')))

describe('send statement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {

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

  test('should return array', async () => {
    const result = await sendStatement(scheduleId, statement)
    expect(result).toStrictEqual([scheduleId, statement])
  })
})
