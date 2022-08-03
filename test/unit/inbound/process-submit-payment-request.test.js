const getPaymentRequestByInvoiceNumber = require('../../../app/inbound/get-payment-request-by-invoice-number')
const saveInvoiceNumber = require('../../../app/inbound/save-invoice-number')
const savePaymentRequest = require('../../../app/inbound/save-payment-request')
const saveInvoiceLines = require('../../../app/inbound/save-invoice-lines')

const processSubmitPaymentRequest = require('../../../app/inbound')

let paymentRequest
let transaction

describe('process payment request', () => {
  beforeEach(() => {
    getPaymentRequestByInvoiceNumber.mockReturnValue(null)
    saveInvoiceNumber.mockReturnValue(undefined)
    savePaymentRequest.mockReturnValue(undefined)
    saveInvoiceLines.mockReturnValue(undefined)

    paymentRequest = JSON.parse(JSON.stringify(require('../../mockPaymentRequest').submitPaymentRequest))
    transaction = 'mock transaction'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getPaymentRequestByInvoiceNumber when a valid paymentRequest is given', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(getPaymentRequestByInvoiceNumber).toHaveBeenCalled()
  })

  test('should call getPaymentRequestByInvoiceNumber once when a valid paymentRequest is given and a previous paymentRequests exist', async () => {
    getPaymentRequestByInvoiceNumber.mockReturnValue(['mock database record return'])
    await processSubmitPaymentRequest(paymentRequest)
    expect(getPaymentRequestByInvoiceNumber).toHaveBeenCalledTimes(1)
  })

  test('should call getPaymentRequestByInvoiceNumber with paymentRequest and transaction when a valid paymentRequest is given and a previous paymentRequests exist', async () => {
    getPaymentRequestByInvoiceNumber.mockReturnValue(['mock database record return'])
    await processSubmitPaymentRequest(paymentRequest)
    expect(getPaymentRequestByInvoiceNumber).toHaveBeenCalledWith({ paymentRequest }, transaction)
  })

  test('should call processSubmitPaymentRequest twice when a valid paymentRequest is given and no previous paymentRequests exist', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(getPaymentRequestByInvoiceNumber).toHaveBeenCalledTimes(2)
  })

  test('should call getPaymentRequestByInvoiceNumber with (paymentRequest and transaction) then (invoiceNumber and transaction) when a valid paymentRequest is given', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    expect(getPaymentRequestByInvoiceNumber).toHaveBeenCalledWith({ paymentRequest }, transaction)
    expect(getPaymentRequestByInvoiceNumber).toHaveBeenCalledWith({ paymentRequest }, transaction)
  })

  test('should not throw when getPaymentRequestByInvoiceNumber throws', async () => {
    getPaymentRequestByInvoiceNumber.mockRejectedValue(new Error('Database retrieve issue'))

    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequest)
    }

    expect(wrapper).not.toThrow()
  })
})
