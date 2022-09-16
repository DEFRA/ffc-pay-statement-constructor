jest.mock('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-request-id')
const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-request-id')

jest.mock('../../../../app/processing/invoice-line/invoice-line-schema')
const schema = require('../../../../app/processing/invoice-line/invoice-line-schema')

const getPositiveInvoiceLine = require('../../../../app/processing/invoice-line/get-positive-invoice-line')

let rawInvoiceLineData
let invoiceLine

describe('get and transform invoice-line object for building a statement object', () => {
  beforeEach(() => {
    const retrievedInvoiceLineData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-invoice-line').rawInvoiceLines[0]))

    rawInvoiceLineData = retrievedInvoiceLineData
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockResolvedValue(rawInvoiceLineData)

    invoiceLine = {
      value: rawInvoiceLineData.value
    }

    schema.validate.mockReturnValue({ value: invoiceLine })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentRequestId when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentRequestId once when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentRequestId).toHaveBeenCalledTimes(1)
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentRequestId with fundingCode and paymentRequestId when a fundingCode and a paymentRequestId are given', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentRequestId).toHaveBeenCalledWith(fundingCode, paymentRequestId)
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

  test('should throw when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws Error', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws error with "Database retrieval issue"', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPositiveInvoiceLine(fundingCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call schema.validate when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    const fundingCode = rawInvoiceLineData.fundingCode
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

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
