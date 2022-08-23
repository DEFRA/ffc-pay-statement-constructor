jest.mock('../../../app/inbound/organisation/process-organisation')
const processOrganisation = require('../../../app/inbound/organisation/process-organisation')

const { processStatementData } = require('../../../app/inbound')

let statementData

describe('process statement data', () => {
  beforeEach(() => {
    statementData = JSON.parse(JSON.stringify(require('../../mock-organisation')))

    processOrganisation.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processOrganisation when a valid statementData is given', async () => {
    await processStatementData(statementData)
    expect(processOrganisation).toHaveBeenCalled()
  })

  test('should call processOrganisation once when a valid statementData is given', async () => {
    await processStatementData(statementData)
    expect(processOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call processOrganisation with statementData when a valid statementData is given', async () => {
    await processStatementData(statementData)
    expect(processOrganisation).toHaveBeenCalledWith(statementData)
  })

  test('should throw when processOrganisation throws', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(statementData)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when processOrganisation throws Error', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(statementData)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Processing organisation issue" when processOrganisation throws error with "Processing organisation issue"', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(statementData)
    }

    expect(wrapper).rejects.toThrow(/^Processing organisation issue$/)
  })
})
