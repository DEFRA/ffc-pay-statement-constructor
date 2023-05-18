jest.mock('../../../app/processing/schedule')
const { schedulePendingPaymentSchedules } = require('../../../app/processing/schedule')

jest.mock('../../../app/processing/payment-schedule')
const { getPaymentSchedule, sendPaymentSchedule, validatePaymentSchedule } = require('../../../app/processing/payment-schedule')

jest.mock('../../../app/processing/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../app/processing/update-schedule-by-schedule-id')

const processPaymentSchedules = require('../../../app/processing/process-payment-schedules')

let retrievedPaymentSchedule

describe('process payment schedules', () => {
  beforeEach(() => {
    const paymentSchedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').SCHEDULE))
    retrievedPaymentSchedule = {
      scheduleId: 1,
      paymentRequestId: paymentSchedule.paymentRequestId
    }

    schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule])
    sendPaymentSchedule.mockResolvedValue(undefined)
    updateScheduleByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call schedulePendingPaymentSchedules', async () => {
    await processPaymentSchedules()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules', async () => {
    await processPaymentSchedules()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules once if schedule construction active', async () => {
    await processPaymentSchedules()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalledTimes(1)
  })

  test('should throw error when schedulePendingPaymentSchedules throws', async () => {
    schedulePendingPaymentSchedules.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processPaymentSchedules()
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schedulePendingPaymentSchedules throws Error', async () => {
    schedulePendingPaymentSchedules.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processPaymentSchedules()
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Processing issue" when schedulePendingPaymentSchedules throws error "Processing issue"', async () => {
    schedulePendingPaymentSchedules.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processPaymentSchedules()
    }

    expect(wrapper).rejects.toThrow(/^Processing issue$/)
  })

  // come back to
  describe('when schedulePendingPaymentSchedules returns 1 record', () => {
    beforeEach(async () => {
      schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule])
      getPaymentSchedule.mockResolvedValue({})
    })

    test('should call getPaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalled()
    })

    test('should call getPaymentSchedule once', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalledTimes(1)
    })

    test('should call getPaymentSchedule with schedulePendingSchedules().paymentRequestId', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalledWith((await schedulePendingPaymentSchedules())[0].paymentRequestId)
    })

    test('should call validatePaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalled()
    })

    test('should call validatePaymentSchedule once', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalledTimes(1)
    })

    test('should call validatePaymentSchedule with getPaymentSchedule()', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalledWith(await getPaymentSchedule())
    })

    describe('when validatePaymentSchedule returns true', () => {
      beforeEach(() => {
        validatePaymentSchedule.mockReturnValue(true)
      })

      test('should call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalled()
      })

      test('should call sendPaymentSchedule once', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledTimes(1)
      })

      test('should call sendPaymentSchedule with getPaymentSchedule()', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledWith(await getPaymentSchedule())
      })

      test('should not throw when sendPaymentSchedule throws', async () => {
        sendPaymentSchedule.mockRejectedValue(new Error('Sending issue'))

        const wrapper = async () => {
          await processPaymentSchedules()
        }

        expect(wrapper).not.toThrow()
      })
    })

    describe('when validatePaymentSchedule returns false', () => {
      beforeEach(() => {
        validatePaymentSchedule.mockReturnValue(false)
      })

      test('should not call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).not.toHaveBeenCalled()
      })
    })

    test('should call updateScheduleByScheduleId', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalled()
    })

    test('should call updateScheduleByScheduleId once', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
    })

    test('should call updateScheduleByScheduleId with schedulePendingPaymentSchedules().scheduleId', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalledWith((await schedulePendingPaymentSchedules())[0].scheduleId)
    })

    test('should return undefined', async () => {
      const res = await processPaymentSchedules()
      expect(res).toBeUndefined()
    })

    test('should not throw when getPaymentSchedule throws', async () => {
      getPaymentSchedule.mockRejectedValue(new Error('Processing issue'))

      const wrapper = async () => {
        await processPaymentSchedules()
      }

      expect(wrapper).not.toThrow()
    })

    test('should not throw when validatePaymentSchedule throws', async () => {
      validatePaymentSchedule.mockReturnValue(new Error('Processing issue'))

      const wrapper = async () => {
        await processPaymentSchedules()
      }

      expect(wrapper).not.toThrow()
    })

    test('should not throw when updateScheduleByScheduleId throws', async () => {
      updateScheduleByScheduleId.mockRejectedValue(new Error('Update issue'))

      const wrapper = async () => {
        await processPaymentSchedules()
      }

      expect(wrapper).not.toThrow()
    })
  })
})
