const moment = require('moment')

const db = require('../../../../app/data')

const { getSupportingSettlements } = require('../../../../app/processing/settlement')
const invoiceNumbers = require('../../../mock-components/mock-invoice-number')
const { SFI: SFI_AGREEMENT_NUMBER } = require('../../../mock-components/mock-agreement-number')
const MARKETING_YEAR = require('../../../mock-components/mock-marketing-year')
const { DATE: SETTLEMENT_DATE } = require('../../../mock-components/mock-dates').SETTLEMENT

let settlementDate
let agreementNumber
let marketingYear

let paymentRequest
let topUpPaymentRequest
let downwardAdjustmentPaymentRequest
let splitPaymentRequestA
let splitPaymentRequestB
let recoveryPaymentRequest

let settlement

describe('get supporting settlements', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    topUpPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').topUpSubmitPaymentRequest))
    downwardAdjustmentPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').downwardAdjustmentSubmitPaymentRequest))
    splitPaymentRequestA = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').splitSubmitPaymentRequestA))
    splitPaymentRequestB = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').splitSubmitPaymentRequestB))
    recoveryPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').recoverySubmitPaymentRequest))

    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    settlement.settlementDate = SETTLEMENT_DATE
  
    settlementDate = SETTLEMENT_DATE
    agreementNumber = SFI_AGREEMENT_NUMBER
    marketingYear = MARKETING_YEAR

    await db.settlement.create(settlement)
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

  test('should return empty array if no completed payment requests', async () => {
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(0)
  })
})
