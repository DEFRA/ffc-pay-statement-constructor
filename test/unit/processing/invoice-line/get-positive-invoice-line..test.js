jest.mock('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-id')
const getPositiveInvoiceLineByFundingCodeAndPaymentId = require('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-id')

jest.mock('../../../../app/processing/invoice-line/invoice-line-schema')
const schema = require('../../../../app/processing/invoice-line/invoice-line-schema')

const getPositiveInvoiceLine = require('../../../../app/processing/invoice-line/get-positive-invoice-line')

let rawInvoiceLineData
let invoiceLine

describe('get and transform invoice-line object for building a statement object', () => {
  beforeEach(() => {
    const retrievedInvoiceLineData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-invoice-line').rawInvoiceLines[0]))

    rawInvoiceLineData = retrievedInvoiceLineData
    getPositiveInvoiceLineByFundingCodeAndPaymentId.mockResolvedValue(rawInvoiceLineData)

    invoiceLine = {
      value: rawInvoiceLineData.value
    }

    schema.validate.mockReturnValue({ value: invoiceLine })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentId when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentId).toHaveBeenCalled()
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentId once when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentId).toHaveBeenCalledTimes(1)
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentId with fundingCode and paymentRequestId when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentId).toHaveBeenCalledWith(fundingCode, paymentRequestId)
  })

  test('should call schema.validate  when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with rawCalculationData and { abortEarly: false } when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalledWith(rawInvoiceLineData, { abortEarly: false })
  })

  test('should throw when getPositiveInvoiceLineByFundingCodeAndPaymentId throws', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getPositiveInvoiceLineByFundingCodeAndPaymentId throws Error', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getPositiveInvoiceLineByFundingCodeAndPaymentId throws error with "Database retrieval issue"', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call schema.validate when getPositiveInvoiceLineByFundingCodeAndPaymentId throws', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getPositiveInvoiceLine(fundingCode, paymentRequestId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Payment request with paymentRequestId: 1 does not have the required invoice-line data for funding code 80101" when schema.validate returns with error key of "Joi validation issue"', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Payment request with paymentRequestId: 1 does not have the required invoice-line data for funding code 80101/)
  })
})
