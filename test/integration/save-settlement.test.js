const db = require('../../app/data')
const saveSettlement = require('../../app/inbound/return/save-settlement')

let settlement

describe('process save settlement', () => {
  beforeEach(() => {
    settlement = JSON.parse(JSON.stringify(require('../mock-settlement')))
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  test('confirm settlement is saved in database when valid settlement is given', async () => {
    await saveSettlement(settlement)
    const result = await db.settlement.findOne()
    expect(result).not.toBeNull()
  })

  test('confirm error is thrown when invalid settlement is given', async () => {
    const emptySettlement = null
    const wrapper = async () => {
      await saveSettlement(emptySettlement)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('confirm settlement is not saved in the database when invalid settlement is given', async () => {
    const emptySettlement = null
    try {
      await saveSettlement(emptySettlement)
    } catch (err) {

    }
    const result = await db.settlement.findOne()
    expect(result).toBeNull()
  })
})
