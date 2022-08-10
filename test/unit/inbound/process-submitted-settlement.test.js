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

jest.mock('../../../app/inbound/get-settlement-by-invoicenumber-and-value')
const getSettlementByInvoiceNumberAndValue = require('../../../app/inbound/get-settlement-by-invoicenumber-and-value')

jest.mock('../../../app/inbound/save-settlement')
const saveSettlement = require('../../../app/inbound/save-settlement')

const processReturnSettlement = require('../../../app/inbound/process-return-settlement')
const settlement = JSON.parse(JSON.stringify(require('../../mock-settlement')))

describe('process return settlement request', () => {
  beforeEach(() => {
    getSettlementByInvoiceNumberAndValue.mockResolvedValue(null)
    saveSettlement.mockResolvedValue(null)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getSettlementByInvoiceNumberAndValue when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(getSettlementByInvoiceNumberAndValue).toBeCalled()
  })

  test('should call getSettlementByInvoiceNumberAndValue once when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(getSettlementByInvoiceNumberAndValue).toBeCalledTimes(1)
  })

  test('should call getSettlementByInvoiceNumberAndValue with "settlement" and "mockTransaction" when valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(getSettlementByInvoiceNumberAndValue).toHaveBeenCalledWith(settlement.invoiceNumber, settlement.value, mockTransaction)
  })

  test('should throw when duplicate settlement found', async () => {
    getSettlementByInvoiceNumberAndValue.mockRejectedValue(new Error('Duplicate settlement recieved'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw an error when duplicate settlement found', async () => {
    getSettlementByInvoiceNumberAndValue.mockRejectedValue(new Error('Duplicate settlement recieved'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should callmockTransaction.rollback when a duplicate settlement is found', async () => {
    const duplicateSettlement = settlement
    getSettlementByInvoiceNumberAndValue.mockResolvedValue(duplicateSettlement)
    await processReturnSettlement(settlement)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should callmockTransaction.rollback once when a duplicate settlement is found', async () => {
    const duplicateSettlement = settlement
    getSettlementByInvoiceNumberAndValue.mockResolvedValue(duplicateSettlement)
    await processReturnSettlement(settlement)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should callmockTransaction.commit when no existing settlement is found', async () => {
    await processReturnSettlement(settlement)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when no existing settlement is found', async () => {
    await processReturnSettlement(settlement)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should call saveSettlement when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalled()
  })

  test('should call saveSettlement once when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call saveSettlement with "settlement" and "mocktransaction"', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalledWith(settlement, mockTransaction)
  })

  test('should throw when saveSettlement is called with invalid settlement', async () => {
    saveSettlement.mockRejectedValue(new Error('Invalid settlement'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })
})
