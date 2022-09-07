jest.mock('../../../../app/processing/schedule/validate-schedule')
const validateSchedule = require('../../../../app/processing/schedule/validate-schedule')

const getValidScheduledSettlements = require('../../../../app/processing/schedule/get-valid-scheduled-settlements')

let retrievedSchedules

describe('get valid scheduled settlements', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../../mock-schedule')))

    const retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    retrievedSchedules = [
      { ...retrievedSchedule },
      { ...retrievedSchedule, scheduleId: 2 }
    ]

    validateSchedule.mockImplementation(() => { return retrievedSchedules[0] })
      .mockImplementationOnce(() => { return retrievedSchedules[0] })
      .mockImplementationOnce(() => { return retrievedSchedules[1] })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call validateSchedule', async () => {
    await getValidScheduledSettlements(retrievedSchedules)
    expect(validateSchedule).toHaveBeenCalled()
  })

  test('should call validateSchedule twice when 2 retrievedSchedules', async () => {
    await getValidScheduledSettlements(retrievedSchedules)
    expect(validateSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call validateSchedule with each retrievedSchedule when 2 retrievedSchedules', async () => {
    await getValidScheduledSettlements(retrievedSchedules)
    expect(validateSchedule).toHaveBeenNthCalledWith(1, retrievedSchedules[0])
    expect(validateSchedule).toHaveBeenNthCalledWith(2, retrievedSchedules[1])
  })

  test('should return both retrievedSchedules when both are valid', async () => {
    const result = await getValidScheduledSettlements(retrievedSchedules)
    expect(result).toStrictEqual(retrievedSchedules)
  })

  test('should not throw when validateSchedule throws both times', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getValidScheduledSettlements(retrievedSchedules)
    }

    expect(wrapper).not.toThrow()
  })

  test('should return empty array when validateSchedule throws both times', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const result = await getValidScheduledSettlements(retrievedSchedules)

    expect(result).toStrictEqual([])
  })

  test('should not throw when validateSchedule throws 1st time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retrievedSchedules[1] })

    const wrapper = async () => {
      await getValidScheduledSettlements(retrievedSchedules)
    }

    expect(wrapper).not.toThrow()
  })

  test('should return [retrievedSchedules[1]] when validateSchedule throws 1st time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retrievedSchedules[1] })

    const result = await getValidScheduledSettlements(retrievedSchedules)

    expect(result).toStrictEqual([retrievedSchedules[1]])
  })

  test('should not throw when validateSchedule throws 2nd time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { return retrievedSchedules[0] })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getValidScheduledSettlements(retrievedSchedules)
    }

    expect(wrapper).not.toThrow()
  })

  test('should return [retrievedSchedules[0]] when validateSchedule throws 1st time', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { return retrievedSchedules[0] })
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })

    const result = await getValidScheduledSettlements(retrievedSchedules)

    expect(result).toStrictEqual([retrievedSchedules[0]])
  })
})
