jest.mock('../../../app/inbound/organisation/process-organisation')
const processOrganisation = require('../../../app/inbound/organisation/process-organisation')

jest.mock('../../../app/inbound/calculation/process-calculation')
const processCalculation = require('../../../app/inbound/calculation/process-calculation')

const { processStatementData } = require('../../../app/inbound')

let organisationData
let calculationData

describe('process statement data', () => {
  beforeEach(() => {
    organisationData = JSON.parse(JSON.stringify(require('../../mock-organisation')))
    calculationData = JSON.parse(JSON.stringify(require('../../mock-calculation')))

    processOrganisation.mockResolvedValue(undefined)
    processCalculation.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processOrganisation when organisationData is given', async () => {
    await processStatementData(organisationData)
    expect(processOrganisation).toHaveBeenCalled()
  })

  test('should call processOrganisation once when organisationData is given', async () => {
    await processStatementData(organisationData)
    expect(processOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call processOrganisation with organisationData when organisationData is given', async () => {
    await processStatementData(organisationData)
    expect(processOrganisation).toHaveBeenCalledWith(organisationData)
  })

  test('should throw when processOrganisation throws', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(organisationData)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when processOrganisation throws Error', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(organisationData)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Processing organisation issue" when processOrganisation throws error with "Processing organisation issue"', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(organisationData)
    }

    expect(wrapper).rejects.toThrow(/^Processing organisation issue$/)
  })

  test('should call processCalculation when calculationData is given', async () => {
    await processStatementData(calculationData)
    expect(processCalculation).toHaveBeenCalled()
  })

  test('should call processCalculation once when calculationData is given', async () => {
    await processStatementData(calculationData)
    expect(processCalculation).toHaveBeenCalledTimes(1)
  })

  test('should call processCalculation with statementData when calculationData is given', async () => {
    await processStatementData(calculationData)
    expect(processCalculation).toHaveBeenCalledWith(calculationData)
  })

  test('should throw when processCalculation throws', async () => {
    processCalculation.mockRejectedValue(new Error('Processing calculation issue'))

    const wrapper = async () => {
      await processCalculation(calculationData)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when processCalculation throws Error', async () => {
    processCalculation.mockRejectedValue(new Error('Processing calculation issue'))

    const wrapper = async () => {
      await processCalculation(calculationData)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Processing calculation issue" when processCalculation throws error with "Processing organisation issue"', async () => {
    processCalculation.mockRejectedValue(new Error('Processing calculation issue'))

    const wrapper = async () => {
      await processCalculation(calculationData)
    }

    expect(wrapper).rejects.toThrow(/^Processing calculation issue$/)
  })
})
