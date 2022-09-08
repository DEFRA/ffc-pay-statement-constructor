
jest.mock('../../../../app/processing/invoice-line/get-invoice-line-by-funding-code-and-payment-id')
const getInvoiceLineByFundingCodeAndPaymentId = require('../../../../app/processing/invoice-line/get-invoice-line-by-funding-code-and-payment-id')

jest.mock('../../../../app/processing/invoice-line/invoice-line-schema')
const schema = require('../../../../app/processing/invoice-line/invoice-line-schema')

const getInvoiceLine = require('../../../../app/processing/invoice-line/get-invoice-line')

let rawInvoiceLineData
let invoiceLine

describe('get and transform invoice-line object for building a statement object', () => {
  beforeEach(() => {
    const retrievedInvoiceLineData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-invoice-line').rawInvoiceLines[0]))

    rawInvoiceLineData = retrievedInvoiceLineData
    getInvoiceLineByFundingCodeAndPaymentId.mockResolvedValue(rawInvoiceLineData)

    invoiceLine = {
      value: rawInvoiceLineData.value
    }

    schema.validate.mockReturnValue({ value: invoiceLine })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getInvoiceLineByFundingCodeAndPaymentId when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getInvoiceLineByFundingCodeAndPaymentId).toHaveBeenCalled()
  })

  test('should call getInvoiceLineByFundingCodeAndPaymentId once when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getInvoiceLineByFundingCodeAndPaymentId).toHaveBeenCalledTimes(1)
  })

  test('should call getInvoiceLineByFundingCodeAndPaymentId with fundingCode and paymentRequestId when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getInvoiceLineByFundingCodeAndPaymentId).toHaveBeenCalledWith(fundingCode, paymentRequestId)
  })

  test('should call schema.validate  when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with rawCalculationData and { abortEarly: false } when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalledWith(rawInvoiceLineData, { abortEarly: false })
  })

  test('should throw when getInvoiceLineByFundingCodeAndPaymentId throws', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getInvoiceLineByFundingCodeAndPaymentId throws Error', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getInvoiceLineByFundingCodeAndPaymentId throws error with "Database retrieval issue"', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call schema.validate when getInvoiceLineByFundingCodeAndPaymentId throws', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getInvoiceLine(fundingCode, paymentRequestId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Payment request with paymentRequestId: 1 does not have the required invoice-line data for funding code 80101" when schema.validate returns with error key of "Joi validation issue"', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Payment request with paymentRequestId: 1 does not have the required invoice-line data for funding code 80101/)
  })
})
