const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../../app/processing/calculation/calculation-schema')
const schema = require('../../../../app/processing/calculation/calculation-schema')

jest.mock('../../../../app/processing/calculation/get-calculation-by-payment-request-id')
const getCalculationByPaymentRequestId = require('../../../../app/processing/calculation/get-calculation-by-payment-request-id')

const getCalculation = require('../../../../app/processing/calculation/get-calculation')

let calculation
let rawCalculationData

describe('get and transform payment request information for building a statement object', () => {
  beforeEach(() => {
    const retrievedCalculationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation').rawCalculationData))

    rawCalculationData = retrievedCalculationData
    calculation = {
      sbi: rawCalculationData.sbi,
      calculated: new Date(rawCalculationData.calculationDate),
      invoiceNumber: rawCalculationData.invoiceNumber,
      paymentRequestId: rawCalculationData.paymentRequestId
    }

    schema.validate.mockReturnValue({ value: calculation })
    getCalculationByPaymentRequestId.mockResolvedValue(rawCalculationData)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCalculationByPaymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getCalculation(paymentRequestId, mockTransaction)
    expect(getCalculationByPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getCalculation(paymentRequestId)
    expect(getCalculationByPaymentRequestId).toHaveBeenCalledTimes(1)
  })

  test('should call getCalculationByPaymentRequestId with paymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getCalculation(paymentRequestId, mockTransaction)
    expect(getCalculationByPaymentRequestId).toHaveBeenCalledWith(paymentRequestId, mockTransaction)
  })

  test('should call schema.validate when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getCalculation(paymentRequestId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getCalculation(paymentRequestId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with rawCalculationData and { abortEarly: false } when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getCalculation(paymentRequestId)
    expect(schema.validate).toHaveBeenCalledWith(rawCalculationData, { abortEarly: false })
  })

  test('should throw when getCalculationByPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getCalculation(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getCalculationByPaymentRequestId throws Error', async () => {
    const paymentRequestId = 1
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getCalculation(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getCalculationByPaymentRequestId throws error with "Database retrieval issue"', async () => {
    const paymentRequestId = 1
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getCalculation(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call schema.validate when getCalculationByPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getCalculation(paymentRequestId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getCalculation(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getCalculation(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Payment request with paymentRequestId: 1 does not have the required Calculation data" when schema.validate returns with error key of "Joi validation issue"', async () => {
    const paymentRequestId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getCalculation(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Payment request with paymentRequestId: 1 does not have the required Calculation data/)
  })
})
