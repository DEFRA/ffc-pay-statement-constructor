jest.mock('../../../../app/processing/payment-request/payment-request-schema')
const schema = require('../../../../app/processing/payment-request/payment-request-schema')

jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')
const getCompletedPaymentRequestByPaymentRequestId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')

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

    schema.validate.mockReturnValue({ value: retreivedPaymentRequest })
    getCompletedPaymentRequestByPaymentRequestId.mockResolvedValue(retreivedPaymentRequest)
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

  test('should call schema.validate when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with retreivedPaymentRequest and { abortEarly: false } when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(schema.validate).toHaveBeenCalledWith(retreivedPaymentRequest, { abortEarly: false })
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

  test('should call mapPaymentRequest with schema.validate().value when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentRequest(paymentRequestId)
    expect(mapPaymentRequest).toHaveBeenCalledWith(schema.validate().value)
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

  test('should not call schema.validate when getCompletedPaymentRequestByPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getPaymentRequest(paymentRequestId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should not call mapPaymentRequest when getCompletedPaymentRequestByPaymentRequestId throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getPaymentRequest(paymentRequestId) } catch {}

    expect(mapPaymentRequest).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Payment request with paymentRequestId: 1 does not have the required data" when schema.validate returns with error key of "Joi validation issue"', async () => {
    const paymentRequestId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getPaymentRequest(paymentRequestId)
    }

    expect(wrapper).rejects.toThrow(/^Payment request with paymentRequestId: 1 does not have the required data/)
  })

  test('should not call mapPaymentRequest when schema.validate returns with error key', async () => {
    const paymentRequestId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

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
