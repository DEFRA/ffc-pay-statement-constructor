jest.mock('../../../../app/processing/schedule/validate-schedule')
const validateSchedule = require('../../../../app/processing/schedule/validate-schedule')

const getValidScheduledSettlements = require('../../../../app/processing/schedule/get-valid-scheduled-settlements')

let retreivedSchedules

describe('get valid scheduled settlements', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../../mock-schedule')))

    const retreivedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    retreivedSchedules = [
      { ...retreivedSchedule },
      { ...retreivedSchedule, scheduleId: 2 }
    ]

    validateSchedule.mockImplementation(() => { return retreivedSchedules[0] })
      .mockImplementationOnce(() => { return retreivedSchedules[0] })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call validateSchedule', async () => {
    await getValidScheduledSettlements(retreivedSchedules)
    expect(validateSchedule).toHaveBeenCalled()
  })

  test('should call validateSchedule twice when 2 retreivedSchedules', async () => {
    await getValidScheduledSettlements(retreivedSchedules)
    expect(validateSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call validateSchedule with each retreivedSchedule when 2 retreivedSchedules', async () => {
    await getValidScheduledSettlements(retreivedSchedules)
    expect(validateSchedule).toHaveBeenNthCalledWith(1, retreivedSchedules[0])
    expect(validateSchedule).toHaveBeenNthCalledWith(2, retreivedSchedules[1])
  })

  test('should return both retreivedSchedules when both are valid', async () => {
    const result = await getValidScheduledSettlements(retreivedSchedules)
    expect(result).toStrictEqual(retreivedSchedules)
  })

  test('should not throw when validateSchedule throws both times', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getValidScheduledSettlements(retreivedSchedules)
    }

    expect(wrapper).not.toThrow()
  })

  test('should return empty array when validateSchedule throws both times', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const result = await getValidScheduledSettlements(retreivedSchedules)

    expect(result).toStrictEqual([])
  })

  test('should not throw when validateSchedule throws 1st time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    const wrapper = async () => {
      await getValidScheduledSettlements(retreivedSchedules)
    }

    expect(wrapper).not.toThrow()
  })

  test('should return [retreivedSchedules[1]] when validateSchedule throws 1st time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    const result = await getValidScheduledSettlements(retreivedSchedules)

    expect(result).toStrictEqual([retreivedSchedules[1]])
  })

  test('should not throw when validateSchedule throws 2nd time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { return retreivedSchedules[0] })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getValidScheduledSettlements(retreivedSchedules)
    }

    expect(wrapper).not.toThrow()
  })

  test('should return [retreivedSchedules[0]] when validateSchedule throws 1st time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { return retreivedSchedules[0] })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const result = await getValidScheduledSettlements(retreivedSchedules)

    expect(result).toStrictEqual([retreivedSchedules[0]])
  })
})
