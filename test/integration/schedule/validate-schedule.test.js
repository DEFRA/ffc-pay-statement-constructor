const validateSchedule = require('../../../app/processing/schedule/validate-schedule')

let retreivedSchedule

describe('validate schedule', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../mock-schedule')))
    retreivedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retreivedSchedule', async () => {
    const result = validateSchedule(retreivedSchedule)
    expect(result).toStrictEqual(retreivedSchedule)
  })

  test('should throw when retreivedSchedule is missing required scheduleId', async () => {
    delete retreivedSchedule.scheduleId

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedSchedule is missing required scheduleId', async () => {
    delete retreivedSchedule.scheduleId

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "scheduleId" is required" when retreivedSchedule is missing required scheduleId', async () => {
    delete retreivedSchedule.scheduleId

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "scheduleId" is required/)
  })

  test('should throw when retreivedSchedule is missing required settlementId', async () => {
    delete retreivedSchedule.settlementId

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedSchedule is missing required settlementId', async () => {
    delete retreivedSchedule.settlementId

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "settlementId" is required" when retreivedSchedule is missing required settlementId', async () => {
    delete retreivedSchedule.settlementId

    const wrapper = async () => {
      validateSchedule(retreivedSchedule)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "settlementId" is required/)
  })
})
