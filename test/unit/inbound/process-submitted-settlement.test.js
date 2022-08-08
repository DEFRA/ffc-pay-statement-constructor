
describe('process submitted settlement request', () => {
  jest.mock('../../../app/inbound/get-existing-settlement')
  const getExistingSettlement = require('../../../app/inbound/get-existing-settlement')

  jest.mock('../../../app/inbound/save-settlement')
  const saveSettlement = require('../../../app/inbound/save-settlement')

  const processSubmittedSettlement = require('../../../app/inbound/process-submitted-settlement')

  let settlement

  beforeEach(() => {
    settlement = {}

    getExistingSettlement.mockResolvedValue(null)
    saveSettlement.mockResolvedValue(null)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call...', async () => {
    await processSubmittedSettlement(settlement)
    expect(getExistingSettlement).toBeCalled()
  })

  // mock the transaction?
})
