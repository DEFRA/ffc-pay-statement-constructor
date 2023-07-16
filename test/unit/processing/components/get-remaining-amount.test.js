const { convertToPounds } = require('../../../../app/utility')

const getRemainingAmount = require('../../../../app/processing/components/get-remaining-amount')

const scheduleDates = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-timelines')))

const paidSegments = scheduleDates.filter(x => !x.outstanding)

const CURRENT_AGREEMENT_VALUE = scheduleDates.reduce((currentAmount, schedule) => currentAmount + Number(schedule.value), 0)
const TOTAL_PAYMENT_MADE = paidSegments.reduce((paidAmount, schedule) => paidAmount + Number(schedule.value), 0)
const CURRENT_REMAINING_AMOUNT = CURRENT_AGREEMENT_VALUE - TOTAL_PAYMENT_MADE
const CURRENT_REMAINING_AMOUNT_POUND = Number(convertToPounds(CURRENT_REMAINING_AMOUNT))

describe('get remaining amount', () => {
  describe('top up', () => {
    const topUpNewValue = CURRENT_AGREEMENT_VALUE + 100

    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, topUpNewValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return value greater than current remaining amount', () => {
      const result = getRemainingAmount(scheduleDates, topUpNewValue)
      expect(result > CURRENT_REMAINING_AMOUNT_POUND).toBeTruthy()
    })
  })

  describe('reduction', () => {
    const reductionNewValue = CURRENT_AGREEMENT_VALUE - 100

    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, reductionNewValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return value less than current remaining amount', () => {
      const result = getRemainingAmount(scheduleDates, reductionNewValue)
      expect(result < CURRENT_REMAINING_AMOUNT_POUND).toBeTruthy()
    })
  })

  describe('reduction to zero', () => {
    const reductionToZeroNewValue = TOTAL_PAYMENT_MADE

    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, reductionToZeroNewValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return value equal to zero', () => {
      const result = getRemainingAmount(scheduleDates, reductionToZeroNewValue)
      expect(result === 0).toBeTruthy()
    })
  })

  describe('recovery', () => {
    const recoveryNewValue = CURRENT_REMAINING_AMOUNT - (CURRENT_REMAINING_AMOUNT + 100)

    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, recoveryNewValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return value less than 0', () => {
      const result = getRemainingAmount(scheduleDates, recoveryNewValue)
      expect(result < 0).toBeTruthy()
    })
  })
})
