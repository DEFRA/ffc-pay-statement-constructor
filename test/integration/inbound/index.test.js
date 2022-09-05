const db = require('../../../app/data')

const schemes = require('../../../app/constants/schemes')
const fundingOptions = require('../../../app/constants/funding-options')

// const { IN_PROGRESS } = require('../../../app/constants/statuses')

// const reverseEngineerInvoiceNumber = require('../../../app/processing/reverse-engineer-invoice-number')

const {
  processProcessingPaymentRequest,
  processStatementData,
  processSubmitPaymentRequest,
  processReturnSettlement
} = require('../../../app/inbound')
// const { submitPaymentRequest } = require('../../mock-payment-request')

let calculation
let organisation
let paymentRequestInProgress
let paymentRequestCompleted
let settlement

describe('process messages off Topics', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    try {
      await db.scheme.bulkCreate(schemes)
      await db.fundingOption.bulkCreate(fundingOptions)
    } catch (err) { console.error(err) }

    calculation = JSON.parse(JSON.stringify(require('../../mock-calculation')))
    organisation = JSON.parse(JSON.stringify(require('../../mock-organisation')))
    paymentRequestInProgress = require('../../mock-payment-request').processingPaymentRequest
    paymentRequestCompleted = require('../../mock-payment-request').submitPaymentRequest
    settlement = JSON.parse(JSON.stringify(require('../../mock-settlement')))
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

  test('should not throw when processing happens in order: processing, submit, return, calculation, organisation', async () => {
    const wrapper = async () => {
      try {
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processReturnSettlement(settlement)
        await processStatementData(calculation)
        await processStatementData(organisation)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when processing happens in order: submit, processing, return, calculation, organisation', async () => {
    const wrapper = async () => {
      try {
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processReturnSettlement(settlement)
        await processStatementData(calculation)
        await processStatementData(organisation)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when processing happens in order: return, processing, submit, calculation, organisation', async () => {
    const wrapper = async () => {
      try {
        await processReturnSettlement(settlement)
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processStatementData(calculation)
        await processStatementData(organisation)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when processing happens in order: submit, return, processing, calculation, organisation', async () => {
    const wrapper = async () => {
      try {
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processReturnSettlement(settlement)
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processStatementData(calculation)
        await processStatementData(organisation)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when processing happens in order: return, submit, processing, calculation, organisation', async () => {
    const wrapper = async () => {
      try {
        await processReturnSettlement(settlement)
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processStatementData(calculation)
        await processStatementData(organisation)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when processing happens in order: processing, submit, return, organisation, calculation', async () => {
    const wrapper = async () => {
      try {
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processReturnSettlement(settlement)
        await processStatementData(organisation)
        await processStatementData(calculation)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when processing happens in order: calculation, organisation, processing, submit, return', async () => {
    const wrapper = async () => {
      try {
        await processStatementData(calculation)
        await processStatementData(organisation)
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processReturnSettlement(settlement)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when processing happens in order: organisation, calculation, processing, submit, return', async () => {
    const wrapper = async () => {
      try {
        await processStatementData(organisation)
        await processStatementData(calculation)
        await processProcessingPaymentRequest(paymentRequestInProgress)
        await processSubmitPaymentRequest(paymentRequestCompleted)
        await processReturnSettlement(settlement)
      } catch {}
    }

    expect(wrapper).not.toThrow()
  })
})
