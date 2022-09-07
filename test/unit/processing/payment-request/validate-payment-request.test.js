jest.mock('../../../../app/processing/payment-request/schema')
const schema = require('../../../../app/processing/payment-request/schema')

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

    schema.validate.mockReturnValue({ value: retreivedPaymentRequest })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retreivedPaymentRequest', async () => {
    const result = validatePaymentRequest(retreivedPaymentRequest)
    expect(result).toBe(retreivedPaymentRequest)
  })

  test('should throw when schema.validate throws', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate throws Error', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validatePaymentRequest(retreivedPaymentRequest)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data/)
  })
})
