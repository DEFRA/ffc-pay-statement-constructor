const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../app/inbound/calculation/get-calculation-by-sbi')
const getCalculationBySbi = require('../../../app/inbound/calculation/get-calculation-by-sbi')

jest.mock('../../../app/inbound/calculation/save-calculation')
const saveCalculation = require('../../../app/inbound/calculation/save-calculation')

jest.mock('../../../app/inbound/calculation/save-placeholder-organisation')
const savePlaceholderOrganisation = require('../../../app/inbound/calculation/save-placeholder-organisation')

jest.mock('../../../app/inbound/calculation/save-fundings')
const saveFundings = require('../../../app/inbound/calculation/save-fundings')

jest.mock('../../../app/inbound/calculation/update-calculation')
const updateCalculation = require('../../../app/inbound/calculation/update-calculation')

const processCalculation = require('../../../app/inbound/calculation')

let calculation

describe('process calculation', () => {
  beforeEach(() => {
    calculation = JSON.parse(JSON.stringify(require('../../mock-calculation')))

    getCalculationBySbi.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue(undefined)
    saveFundings.mockResolvedValue(undefined)
    saveCalculation.mockResolvedValue({ ...calculation, calculationId: 1 })
    updateCalculation.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCalculationBySbi when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(getCalculationBySbi).toHaveBeenCalled()
  })

  test('should call getCalculationBySbi once when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(getCalculationBySbi).toHaveBeenCalledTimes(1)
  })

  test('should call getCalculationBySbi with calculation.sbi and mockTransaction when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(getCalculationBySbi).toHaveBeenCalledWith(calculation.sbi, mockTransaction)
  })

  test('should call savePlaceholderOrganisation when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(savePlaceholderOrganisation).toHaveBeenCalled()
  })

  test('should call savePlaceholderOrganisation once when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(savePlaceholderOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call savePlaceholderOrganisation with { sbi: calculation.sbi} and calculation.sbi when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(savePlaceholderOrganisation).toHaveBeenCalledWith({ sbi: calculation.sbi }, calculation.sbi)
  })

  test('should call saveCalculation when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(saveCalculation).toHaveBeenCalled()
  })

  test('should call saveCalculation once when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(saveCalculation).toHaveBeenCalledTimes(1)
  })

  test('should call saveCalculation with calculation and mockTransaction when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(saveCalculation).toHaveBeenCalledWith(calculation, mockTransaction)
  })

  test('should call saveFundings when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(saveFundings).toHaveBeenCalled()
  })

  test('should call saveFundings once when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(saveFundings).toHaveBeenCalledTimes(1)
  })

  test('should call saveFundings with calculation.fundings, saveCalculation().calculationId and mockTransaction when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(saveFundings).toHaveBeenCalledWith(calculation.fundings, (await saveCalculation()).calculationId, mockTransaction)
  })

  test('should call updateCalculation when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(updateCalculation).toHaveBeenCalled()
  })

  test('should call updateCalculation once when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(updateCalculation).toHaveBeenCalledTimes(1)
  })

  test('should call updateCalculation with calculation.invoiceNumber, saveCalculation().calculationId and mockTransaction when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(updateCalculation).toHaveBeenCalledWith(calculation.invoiceNumber, (await saveCalculation()).calculationId, mockTransaction)
  })

  test('should call mockTransaction.commit when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when a valid calculation is given and a previous calculation does not exist', async () => {
    await processCalculation(calculation)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when a valid calculation is given and a previous calculation does not exist and nothing throws', async () => {
    await processCalculation(calculation)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should call getCalculationBySbi when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(getCalculationBySbi).toHaveBeenCalled()
  })

  test('should call getCalculationBySbi once when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(getCalculationBySbi).toHaveBeenCalledTimes(1)
  })

  test('should call getCalculationBySbi with calculation.sbi and mockTransaction when a valid calculation is given and a previous calculation does not exist', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(getCalculationBySbi).toHaveBeenCalledWith(calculation.sbi, mockTransaction)
  })

  test('should call mockTransaction.rollback when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call savePlaceholderOrganisation when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(savePlaceholderOrganisation).not.toHaveBeenCalled()
  })

  test('should not call saveCalculation when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(saveCalculation).not.toHaveBeenCalled()
  })

  test('should not call saveFundings when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(saveFundings).not.toHaveBeenCalled()
  })

  test('should not call updateCalculation when a valid calculation is given and a previous calculation exists', async () => {
    getCalculationBySbi.mockResolvedValue(calculation)
    await processCalculation(calculation)
    expect(updateCalculation).not.toHaveBeenCalled()
  })

  test('should throw when getCalculationBySbi throws', async () => {
    getCalculationBySbi.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getCalculationBySbi throws Error', async () => {
    getCalculationBySbi.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getCalculationBySbi throws error with "Database retrieval issue"', async () => {
    getCalculationBySbi.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should throw when savePlaceholderOrganisation throws', async () => {
    savePlaceholderOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when savePlaceholderOrganisation throws Error', async () => {
    savePlaceholderOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when savePlaceholderOrganisation throws error with "Database save down issue"', async () => {
    savePlaceholderOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when saveCalculation throws', async () => {
    saveCalculation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveCalculation throws Error', async () => {
    saveCalculation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveCalculation throws error with "Database save down issue"', async () => {
    saveCalculation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when saveFundings throws', async () => {
    saveFundings.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveFundings throws Error', async () => {
    saveFundings.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveFundings throws error with "Database save down issue"', async () => {
    saveFundings.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when updateCalculation throws', async () => {
    updateCalculation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when updateCalculation throws Error', async () => {
    updateCalculation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when updateCalculation throws error with "Database save down issue"', async () => {
    updateCalculation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Sequelize transaction issue" when mockTransaction.commit throws error with "Sequelize transaction commit issue"', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processCalculation(calculation)
    }

    expect(wrapper).rejects.toThrow(/^Sequelize transaction commit issue$/)
  })

  test('should call mockTransaction.rollback when getCalculationBySbi throws', async () => {
    getCalculationBySbi.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getCalculationBySbi throws', async () => {
    getCalculationBySbi.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveFundings throws', async () => {
    saveFundings.mockRejectedValue(new Error('Database save down issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveFundings throws', async () => {
    saveFundings.mockRejectedValue(new Error('Database save down issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveCalculation throws', async () => {
    saveCalculation.mockRejectedValue(new Error('Database save down issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveCalculation throws', async () => {
    saveCalculation.mockRejectedValue(new Error('Database save down issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when updateCalculation throws', async () => {
    updateCalculation.mockRejectedValue(new Error('Database save down issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when updateCalculation throws', async () => {
    updateCalculation.mockRejectedValue(new Error('Database save down issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processCalculation(calculation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})
