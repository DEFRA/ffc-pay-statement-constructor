jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')
const getCompletedPaymentRequestByPaymentRequestId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')

jest.mock('../../../../app/processing/payment-request/validate-payment-request')
const validatePaymentRequest = require('../../../../app/processing/payment-request/validate-payment-request')

jest.mock('../../../../app/processing/payment-request/map-payment-request')
const mapPaymentRequest = require('../../../../app/processing/payment-request/map-payment-request')

const getPaymentRequest = require('../../../../app/processing/payment-request/get-payment-request')

let retreivedPaymentRequest
let mappedPaymentRequest

const { NAMES: SCHEDULE_NAMES } = require('../../../../app/constants/schedules')

describe('get and map required payment request information for building a statement object', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest))

    retreivedPaymentRequest = {
      paymentRequestId: 1,
      dueDate: paymentRequest.dueDate,
      marketingYear: paymentRequest.marketingYear,
      schedule: paymentRequest.schedule
    }

    mappedPaymentRequest = {
      paymentRequestId: retreivedPaymentRequest.paymentRequestId,
      dueDate: retreivedPaymentRequest.dueDate,
      frequency: SCHEDULE_NAMES[retreivedPaymentRequest.schedule],
      year: retreivedPaymentRequest.marketingYear
    }

    getCompletedPaymentRequestByPaymentRequestId.mockResolvedValue(retreivedPaymentRequest)
    validatePaymentRequest.mockReturnValue(retreivedPaymentRequest)
    mapPaymentRequest.mockResolvedValue(mappedPaymentRequest)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalledTimes(1)
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId with paymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalledWith(paymentRequestId)
  })

  test('should call validatePaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(validatePaymentRequest).toHaveBeenCalled()
  })

  test('should call validatePaymentRequest once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(validatePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call validatePaymentRequest with retreivedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(validatePaymentRequest).toHaveBeenCalledWith(retreivedPaymentRequest)
  })

  test('should call mapPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(mapPaymentRequest).toHaveBeenCalled()
  })

  test('should call mapPaymentRequest once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(mapPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call mapPaymentRequest with retreivedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(mapPaymentRequest).toHaveBeenCalledWith(retreivedPaymentRequest)
  })

  test('should return mappedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    const result = await getPaymentRequest(paymentRequestId)
    expect(result).toStrictEqual(mappedPaymentRequest)
  })

  test('should throw when getCompletedPaymentRequestByPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getCompletedPaymentRequestByPaymentRequestId throws Error', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getCompletedPaymentRequestByPaymentRequestId throws error with "Database retrieval issue"', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call validatePaymentRequest when getCompletedPaymentRequestByPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getPaymentRequest(paymentRequestId) } catch {}

    expect(validatePaymentRequest).not.toHaveBeenCalled()
  })

  test('should not call mapPaymentRequest when getCompletedPaymentRequestByPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getPaymentRequest(paymentRequestId) } catch {}

    expect(mapPaymentRequest).not.toHaveBeenCalled()
  })

  test('should throw when validatePaymentRequest throws', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when validatePaymentRequest throws Error', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Joi validation issue" when validatePaymentRequest throws with "Joi validation issue"', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation error$/)
  })

  test('should not call mapPaymentRequest when validatePaymentRequest throws', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    try { await getPaymentRequest(paymentRequestId) } catch {}

    expect(mapPaymentRequest).not.toHaveBeenCalled()
  })

  test('should throw when mapPaymentRequest throws', async () => {
    const paymentRequestId = 1
    mapPaymentRequest.mockRejectedValue(new Error('Payment request mapping issue'))

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mapPaymentRequest throws Error', async () => {
    const paymentRequestId = 1
    mapPaymentRequest.mockRejectedValue(new Error('Payment request mapping issue'))

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Payment request mapping issue" when mapPaymentRequest throws error with "Payment request mapping issue"', async () => {
    const paymentRequestId = 1
    mapPaymentRequest.mockRejectedValue(new Error('Payment request mapping issue'))

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Payment request mapping issue$/)
  })
})
