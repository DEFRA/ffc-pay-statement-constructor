jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-correlation-id')
const getCompletedPaymentRequestByCorrelationId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-correlation-id')

jest.mock('../../../../app/processing/schedule')
const { getCompletedSchedule } = require('../../../../app/processing/schedule')

const { getPreviousPaymentRequestsWithPaymentSchedules } = require('../../../../app/processing/payment-request')

describe('get previous payment requests with payment schedules', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return previousPaymentRequests when no previousPaymentRequests', async () => {
    const previousPaymentRequests = []
    const result = await getPreviousPaymentRequestsWithPaymentSchedules(previousPaymentRequests)
    expect(result).toStrictEqual(previousPaymentRequests)
  })
})
