const getRemainingAmount = require('../../../../app/processing/components/get-remaining-amount')
const scheduleDates = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-timelines')))

describe('get remaining amount', () => {
  describe('top up', () => {
    const topUpNewValue = 150000
    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, topUpNewValue)
      expect(result).toEqual(expect.any(Number))
    })
  })

  describe('reduction', () => {
    const topUpNewValue = 90000
    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, topUpNewValue)
      expect(result).toEqual(expect.any(Number))
    })
  })

  describe('reduction to zero', () => {
    const topUpNewValue = 50000
    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, topUpNewValue)
      expect(result).toEqual(expect.any(Number))
    })
  })

  describe('recovery', () => {
    const topUpNewValue = 30000
    test('should return remaining amount as number', () => {
      const result = getRemainingAmount(scheduleDates, topUpNewValue)
      expect(result).toEqual(expect.any(Number))
    })
  })

  /* test('should return remaining amount as number', () => {
    const result = getRemainingAmount(scheduleDates)
    expect(result).toEqual(expect.any(Number))
  })

  test('should return sum of the property value of all items in scheduleDates', () => {
    const result = getRemainingAmount(scheduleDates)
    expect(result).toBe(750)
  })

  test('returns zero (0) if no schedule date', () => {
    const result = getRemainingAmount([])
    expect(result).toBe(0)
  }) */
})
