const db = require('../../app/data')

jest.mock('../../app/inbound/get-completed-payment-request-by-invoice-number')
const getCompletedPaymentRequestbyInvoiceNumber = require('../../app/inbound/get-completed-payment-request-by-invoice-number')
const saveSettlement = require('../../app/inbound/return/save-settlement')

let settlement
let paymentRequest

describe('process save settlement', () => {
  beforeEach(() => {
    settlement = JSON.parse(JSON.stringify(require('../mock-settlement')))
    paymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request')))
    getCompletedPaymentRequestbyInvoiceNumber.mockResolvedValue(paymentRequest)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  test('should call getCompletedPaymentRequestbyInvoiceNumber with "settlement.invoiceNumber" and "mockTransaction" when valid settlement is given', async () => {
    const transaction = await db.sequelize.transaction()
    await saveSettlement(settlement, transaction)
    await transaction.commit()
    expect(getCompletedPaymentRequestbyInvoiceNumber).toHaveBeenCalledWith(settlement.invoiceNumber, transaction)
  })

  test('confirm settlement is saved in database when valid settlement is given', async () => {
    await saveSettlement(settlement)
    const result = await db.settlement.findOne()
    expect(result).not.toBeNull()
  })
})
