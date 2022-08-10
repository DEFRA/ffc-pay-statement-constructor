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

describe('process submitted settlement request', () => {
  jest.mock('../../../app/inbound/get-existing-settlement')
  const getExistingSettlement = require('../../../app/inbound/get-existing-settlement')

  jest.mock('../../../app/inbound/save-settlement')
  const saveSettlement = require('../../../app/inbound/save-settlement')

  const processReturnSettlement = require('../../../app/inbound/process-return-settlement')

  let settlement

  beforeEach(() => {
    settlement = {
      sourceSystem: 'SITIAgri',
      invoiceNumber: 'S123456789A123456V003',
      frn: 1234567890,
      currency: 'GBP',
      value: 30000,
      settlementDate: 'Fri Jan 21 2022 10:38:44 GMT+0000 (Greenwich Mean Time)',
      reference: 'PY1234567',
      settled: true
    }

    getExistingSettlement.mockResolvedValue(null)
    saveSettlement.mockResolvedValue(null)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getExistingSettlement when a valid settlement is given ', async () => {
    await processReturnSettlement(settlement)
    expect(getExistingSettlement).toBeCalled()
  })

  test('should call getExistingSettlement once when a valid settlement is given ', async () => {
    await processReturnSettlement(settlement)
    expect(getExistingSettlement).toBeCalledTimes(1)
  })

  test('should call getExistingSettlement with "settlement" and "mockTransaction" when valid settlement is given ', async () => {
    await processReturnSettlement(settlement)
    expect(getExistingSettlement).toHaveBeenCalledWith(settlement, mockTransaction)
  })

  test('should log "Duplicate settlement received, skipping {duplicateSettlement.reference}" when getExistingSettlement returns a settlement ', async () => {
    const consoleSpy = jest.spyOn(console, 'info')
    const duplicateSettlement = settlement
    getExistingSettlement.mockResolvedValue(duplicateSettlement)

    await processReturnSettlement(settlement)

    expect(consoleSpy).toHaveBeenCalledWith(`Duplicate settlement received, skipping ${duplicateSettlement.reference}`)
  })

  test('should throw when duplicate settlement found ', async () => {
    getExistingSettlement.mockRejectedValue(new Error('Duplicate settlement recieved'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw an error when duplicate settlement found ', async () => {
    getExistingSettlement.mockRejectedValue(new Error('Duplicate settlement recieved'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should callmockTransaction.rollback when a duplicate settlement is found ', async () => {
    const duplicateSettlement = settlement
    getExistingSettlement.mockResolvedValue(duplicateSettlement)
    await processReturnSettlement(settlement)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should callmockTransaction.rollback once when a duplicate settlement is found ', async () => {
    const duplicateSettlement = settlement
    getExistingSettlement.mockResolvedValue(duplicateSettlement)
    await processReturnSettlement(settlement)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should callmockTransaction.commit when no existing settlement is found ', async () => {
    await processReturnSettlement(settlement)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when no existing settlement is found ', async () => {
    await processReturnSettlement(settlement)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should call saveSettlement when a valid settlement is given ', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalled()
  })

  test('should call saveSettlement once when a valid settlement is given ', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call saveSettlement with settlement and mocktransaction ', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalledWith(settlement, mockTransaction)
  })

  test('should throw when saveSettlement is called with invalid settlement ', async () => {
    saveSettlement.mockRejectedValue(new Error('Invalid settlement'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })
})
