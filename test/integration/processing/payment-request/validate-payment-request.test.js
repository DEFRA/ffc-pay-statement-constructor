const { DAX_CODES } = require('../../../../app/constants/schedules')

const validatePaymentRequest = require('../../../../app/processing/payment-request/validate-payment-request')

let retreivedPaymentRequest

describe('validate payment request', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest))
    retreivedPaymentRequest = {
      paymentRequestId: 1,
      dueDate: new Date(paymentRequest.dueDate),
      marketingYear: paymentRequest.marketingYear,
      schedule: paymentRequest.schedule
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retreivedPaymentRequest', async () => {
    const result = validatePaymentRequest(retreivedPaymentRequest)
    expect(result).toStrictEqual(retreivedPaymentRequest)
  })

  test('should throw when retreivedPaymentRequest is missing required paymentRequestId', async () => {
    delete retreivedPaymentRequest.paymentRequestId

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedPaymentRequest is missing required paymentRequestId', async () => {
    delete retreivedPaymentRequest.paymentRequestId

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "paymentRequestId" is required" when retreivedPaymentRequest is missing required paymentRequestId', async () => {
    delete retreivedPaymentRequest.paymentRequestId

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "paymentRequestId" is required/)
  })

  test('should throw when retreivedPaymentRequest is missing required dueDate', async () => {
    delete retreivedPaymentRequest.dueDate

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedPaymentRequest is missing required dueDate', async () => {
    delete retreivedPaymentRequest.dueDate

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "dueDate" is required" when retreivedPaymentRequest is missing required dueDate', async () => {
    delete retreivedPaymentRequest.dueDate

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "dueDate" is required/)
  })

  test('should throw when retreivedPaymentRequest is missing required marketingYear', async () => {
    delete retreivedPaymentRequest.marketingYear

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedPaymentRequest is missing required marketingYear', async () => {
    delete retreivedPaymentRequest.marketingYear

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "marketingYear" is required" when retreivedPaymentRequest is missing required marketingYear', async () => {
    delete retreivedPaymentRequest.marketingYear

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "marketingYear" is required/)
  })

  test('should not throw when retreivedPaymentRequest is missing optional schedule', async () => {
    delete retreivedPaymentRequest.schedule

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).not.toThrow()
  })

  test('should return retreivedPaymentRequest with default DAX_CODES.QUARTERLY schedule when retreivedPaymentRequest is missing optional schedule', async () => {
    delete retreivedPaymentRequest.schedule

    const result = validatePaymentRequest(retreivedPaymentRequest)

    const defaultSchedulePaymentRequest = { ...retreivedPaymentRequest, schedule: DAX_CODES.QUARTERLY }
    expect(result).toStrictEqual(defaultSchedulePaymentRequest)
  })
})
