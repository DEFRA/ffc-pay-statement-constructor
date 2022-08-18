const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

const { COMPLETED } = require('../../../app/constants/statuses')

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

jest.mock('../../../app/data/get-completed-payment-request-by-reference-id')
const getCompletedPaymentRequestByReferenceId = require('../../../app/data/get-completed-payment-request-by-reference-id')

jest.mock('../../../app/data/save-invoice-number')
const saveInvoiceNumber = require('../../../app/data/save-invoice-number')

jest.mock('../../../app/data/save-payment-request')
const savePaymentRequest = require('../../../app/data/save-payment-request')

jest.mock('../../../app/data/save-invoice-lines')
const saveInvoiceLines = require('../../../app/data/save-invoice-lines')

const { processSubmitPaymentRequest } = require('../../../app/inbound')

let paymentRequest

describe('process submit payment request', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-payment-request').submitPaymentRequest))

    getCompletedPaymentRequestByReferenceId.mockResolvedValue(null)
    saveInvoiceNumber.mockResolvedValue(undefined)
    savePaymentRequest.mockResolvedValue(paymentRequest)
    saveInvoiceLines.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCompletedPaymentRequestByReferenceId when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(getCompletedPaymentRequestByReferenceId).toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequestByReferenceId once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(getCompletedPaymentRequestByReferenceId).toHaveBeenCalledTimes(1)
  })

  test('should call getCompletedPaymentRequestByReferenceId with paymentRequest.referenceId and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(getCompletedPaymentRequestByReferenceId).toHaveBeenCalledWith(paymentRequest.referenceId, mockTransaction)
  })

  test('should call saveInvoiceNumber when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(saveInvoiceNumber).toHaveBeenCalled()
  })

  test('should call saveInvoiceNumber once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(saveInvoiceNumber).toHaveBeenCalledTimes(1)
  })

  test('should call saveInvoiceNumber with paymentRequest.invoiceNumber and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(saveInvoiceNumber).toHaveBeenCalledWith(paymentRequest.invoiceNumber, mockTransaction)
  })

  test('should call savePaymentRequest when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(savePaymentRequest).toHaveBeenCalled()
  })

  test('should call savePaymentRequest once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(savePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call savePaymentRequest with paymentRequest with status: COMPLETED and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(savePaymentRequest).toHaveBeenCalledWith({ ...paymentRequest, status: COMPLETED }, mockTransaction)
  })

  test('should call saveInvoiceLines when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(saveInvoiceLines).toHaveBeenCalled()
  })

  test('should call saveInvoiceLines once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(saveInvoiceLines).toHaveBeenCalledTimes(1)
  })

  test('should call saveInvoiceLines with paymentRequest.invoiceLines, paymentRequest.paymentRequestId and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(saveInvoiceLines).toHaveBeenCalledWith(paymentRequest.invoiceLines, paymentRequest.paymentRequestId, mockTransaction)
  })

  test('should call mockTransaction.commit when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when a valid paymentRequest is given and a previous paymentRequest does not exist and nothing throws', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequestByReferenceId when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getCompletedPaymentRequestByReferenceId.mockResolvedValue(paymentRequest)
    await processSubmitPaymentRequest(paymentRequest)
    expect(getCompletedPaymentRequestByReferenceId).toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequestByReferenceId once when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getCompletedPaymentRequestByReferenceId.mockResolvedValue(paymentRequest)
    await processSubmitPaymentRequest(paymentRequest)
    expect(getCompletedPaymentRequestByReferenceId).toHaveBeenCalledTimes(1)
  })

  test('should call getCompletedPaymentRequestByReferenceId with paymentRequest.referenceId and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    getCompletedPaymentRequestByReferenceId.mockResolvedValue(paymentRequest)
    await processSubmitPaymentRequest(paymentRequest)
    expect(getCompletedPaymentRequestByReferenceId).toHaveBeenCalledWith(paymentRequest.referenceId, mockTransaction)
  })

  test('should call mockTransaction.rollback when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getCompletedPaymentRequestByReferenceId.mockResolvedValue(paymentRequest)
    await processSubmitPaymentRequest(paymentRequest)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getCompletedPaymentRequestByReferenceId.mockResolvedValue(paymentRequest)
    await processSubmitPaymentRequest(paymentRequest)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should throw when getCompletedPaymentRequestByReferenceId throws', async () => {
    getCompletedPaymentRequestByReferenceId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getCompletedPaymentRequestByReferenceId throws Error', async () => {
    getCompletedPaymentRequestByReferenceId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getCompletedPaymentRequestByReferenceId throws error with "Database retrieval issue"', async () => {
    getCompletedPaymentRequestByReferenceId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should throw when saveInvoiceNumber throws', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveInvoiceNumber throws Error', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveInvoiceNumber throws error with "Database save down issue"', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when savePaymentRequest throws', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when savePaymentRequest throws Error', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when savePaymentRequest throws error with "Database save down issue"', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when saveInvoiceLines throws', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveInvoiceLines throws Error', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveInvoiceLines throws error with "Database save down issue"', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Sequelize transaction issue" when mockTransaction.commit throws error with "Sequelize transaction commit issue"', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Sequelize transaction commit issue$/)
  })

  test('should call mockTransaction.rollback when getCompletedPaymentRequestByReferenceId throws', async () => {
    getCompletedPaymentRequestByReferenceId.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getCompletedPaymentRequestByReferenceId throws', async () => {
    getCompletedPaymentRequestByReferenceId.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveInvoiceNumber throws', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveInvoiceNumber throws', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when savePaymentRequest throws', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when savePaymentRequest throws', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveInvoiceLines throws', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveInvoiceLines throws', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processSubmitPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})
