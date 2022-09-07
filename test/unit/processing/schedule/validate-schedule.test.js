jest.mock('../../../../app/processing/schedule/schema')
const schema = require('../../../../app/processing/schedule/schema')

const validateSchedule = require('../../../../app/processing/schedule/validate-schedule')

let retreivedSchedule

describe('validate schedule', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../../mock-schedule')))

    retreivedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    schema.validate.mockReturnValue({ value: retreivedSchedule })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retreivedSchedule', async () => {
    const result = validateSchedule(retreivedSchedule)
    expect(result).toBe(retreivedSchedule)
  })

  test('should throw when schema.validate throws', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate throws Error', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data/)
  })
})
