const db = require('../../../app/data')

jest.mock('../../../app/inbound/get-completed-payment-request-by-invoice-number')
const getCompletedPaymentRequestbyInvoiceNumber = require('../../../app/inbound/get-completed-payment-request-by-invoice-number')
const saveSettlement = require('../../../app/inbound/return/save-settlement')

let settlement
let paymentRequest
describe('process save settlement', () => {
  beforeEach(() => {
    settlement = JSON.parse(JSON.stringify(require('../../mock-settlement')))
    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-payment-request')))
    getCompletedPaymentRequestbyInvoiceNumber.mockResolvedValue(paymentRequest)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  test('should call getCompletedPaymentRequestbyInvoiceNumber when a valid settlement is given', async () => {
    await saveSettlement(settlement)
    expect(getCompletedPaymentRequestbyInvoiceNumber).toBeCalled()
  })

  test('should call getCompletedPaymentRequestbyInvoiceNumber once when a valid settlement is given', async () => {
    await saveSettlement(settlement)
    expect(getCompletedPaymentRequestbyInvoiceNumber).toBeCalledTimes(1)
  })

  test('should call getCompletedPaymentRequestbyInvoiceNumber with "settlement.invoiceNumber" and "mockTransaction" when valid settlement is given', async () => {
    const transaction = await db.sequelize.transaction()
    await saveSettlement(settlement, transaction)
    await transaction.commit()
    expect(getCompletedPaymentRequestbyInvoiceNumber).toHaveBeenCalledWith(settlement.invoiceNumber, transaction)
  })

  test('should throw when getCompletedPaymentRequestbyInvoiceNumber throws', async () => {
    getCompletedPaymentRequestbyInvoiceNumber.mockRejectedValue(new Error('Database retrieval issue'))
    const wrapper = async () => {
      await saveSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getCompletedPaymentRequestbyInvoiceNumber throws', async () => {
    getCompletedPaymentRequestbyInvoiceNumber.mockRejectedValue(new Error('Database retrieval issue'))
    const wrapper = async () => {
      await saveSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('confirm there is no settlement when settlement table is empty', async () => {
    const result = await db.settlement.findOne()
    expect(result).toBeNull()
  })

  test('confirm settlement is saved in database when valid settlement is given', async () => {
    await saveSettlement(settlement)
    const result = await db.settlement.findOne()
    expect(result).not.toBeNull()
  })
})
