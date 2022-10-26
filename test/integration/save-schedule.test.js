const db = require('../../app/data')

const saveSchedule = require('../../app/inbound/return/save-schedule')

let settlement

describe('process save settlement', () => {
  beforeEach(async () => {
    settlement = JSON.parse(JSON.stringify(require('../mock-settlement')))
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  test('confirm schedule is saved in the database when saved-settlement is given', async () => {
    const savedSettlement = await db.settlement.create(settlement)
    const savedSchedule = await saveSchedule(savedSettlement)
    expect(savedSchedule).not.toBeNull()
  })

  test('confirm error is thrown when unsaved settlement is given', async () => {
    settlement.settlementId = 1
    const wrapper = async () => {
      await saveSchedule(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })
})
