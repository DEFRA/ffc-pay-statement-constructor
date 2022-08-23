const db = require('../../app/data')
const schemes = require('../../app/constants/schemes')

const processReturnSettlement = require('../../app/inbound/process-return-settlement')

let settlement
let paymentRequest

describe('process submit payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    settlement = JSON.parse(JSON.stringify(require('../mock-settlement')))
    paymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request').paymentRequest))
    try {
      await db.scheme.bulkCreate(schemes)
      await db.invoiceNumber.create({ invoiceNumber: paymentRequest.invoiceNumber, originalInvoiceNumber: 'kfgdhkf' })
      await db.paymentRequest.create(paymentRequest)
    } catch (err) {
      console.error(err)
    }
  })

  afterEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should do something', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result).not.toBeNull()
  })
})
