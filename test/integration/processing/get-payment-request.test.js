const db = require('../../../app/data')

const schemes = require('../../../app/constants/schemes')
const { NAMES: SCHEDULE_NAMES } = require('../../../app/constants/schedules')
// const fundingOptions = require('../../../app/constants/funding-options')

const getPaymentRequest = require('../../../app/processing/payment-request')

const PAYMENT_REQUEST_ID_IN_PROGRESS = 1
const PAYMENT_REQUEST_ID_COMPLETED = 2

let paymentRequestInProgress
let paymentRequestCompleted

describe('process payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))
    paymentRequestInProgress = JSON.parse(JSON.stringify(require('../../mock-payment-request').processingPaymentRequest))
    paymentRequestCompleted = JSON.parse(JSON.stringify(require('../../mock-payment-request').submitPaymentRequest))

    await db.scheme.bulkCreate(schemes)
    // await db.fundingOption.bulkCreate(fundingOptions)
    await db.invoiceNumber.create({
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      originalInvoiceNumber: paymentRequestInProgress.invoiceNumber.slice(0, 5)
    })
    delete paymentRequestInProgress.paymentRequestId
    delete paymentRequestCompleted.paymentRequestId
    await db.paymentRequest.create(paymentRequestInProgress)
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

  test('should return mapped payment request object when existing completed payment request with required information exists', async () => {
    await db.paymentRequest.create(paymentRequestCompleted)

    const result = await getPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED)

    expect(result).toStrictEqual({
      paymentRequestId: PAYMENT_REQUEST_ID_COMPLETED,
      dueDate: new Date(paymentRequestCompleted.dueDate),
      frequency: SCHEDULE_NAMES.QUARTERLY,
      year: paymentRequestCompleted.marketingYear
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and no optional schedule', async () => {
    delete paymentRequestCompleted.schedule
    await db.paymentRequest.create(paymentRequestCompleted)

    const result = await getPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED)

    expect(result).toStrictEqual({
      paymentRequestId: PAYMENT_REQUEST_ID_COMPLETED,
      dueDate: new Date(paymentRequestCompleted.dueDate),
      frequency: SCHEDULE_NAMES.QUARTERLY,
      year: paymentRequestCompleted.marketingYear
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and undefined optional schedule', async () => {
    paymentRequestCompleted.schedule = undefined
    await db.paymentRequest.create(paymentRequestCompleted)

    const result = await getPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED)

    expect(result).toStrictEqual({
      paymentRequestId: PAYMENT_REQUEST_ID_COMPLETED,
      dueDate: new Date(paymentRequestCompleted.dueDate),
      frequency: SCHEDULE_NAMES.QUARTERLY,
      year: paymentRequestCompleted.marketingYear
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and null optional schedule', async () => {
    paymentRequestCompleted.schedule = null
    await db.paymentRequest.create(paymentRequestCompleted)

    const result = await getPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED)

    expect(result).toStrictEqual({
      paymentRequestId: PAYMENT_REQUEST_ID_COMPLETED,
      dueDate: new Date(paymentRequestCompleted.dueDate),
      frequency: SCHEDULE_NAMES.QUARTERLY,
      year: paymentRequestCompleted.marketingYear
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and unrecognised optional schedule', async () => {
    paymentRequestCompleted.schedule = 'NR'
    await db.paymentRequest.create(paymentRequestCompleted)

    const result = await getPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED)

    expect(result).toStrictEqual({
      paymentRequestId: PAYMENT_REQUEST_ID_COMPLETED,
      dueDate: new Date(paymentRequestCompleted.dueDate),
      frequency: SCHEDULE_NAMES.QUARTERLY,
      year: paymentRequestCompleted.marketingYear
    })
  })

  test('should throw when no existing payment requests exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getPaymentRequest(1) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing payment requests exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getPaymentRequest(undefined) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing payment requests exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getPaymentRequest(null) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing in progress payment request with required information exists', async () => {
    const wrapper = async () => { await getPaymentRequest(PAYMENT_REQUEST_ID_IN_PROGRESS) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing completed payment request with missing required dueDate does not exist', async () => {
    delete paymentRequestCompleted.dueDate
    await db.paymentRequest.create(paymentRequestCompleted)

    const wrapper = async () => { await getPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing completed payment request with missing required marketingYear does not exist', async () => {
    delete paymentRequestCompleted.marketingYear
    await db.paymentRequest.create(paymentRequestCompleted)

    const wrapper = async () => { await getPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED) }
    expect(wrapper).rejects.toThrow()
  })
})
