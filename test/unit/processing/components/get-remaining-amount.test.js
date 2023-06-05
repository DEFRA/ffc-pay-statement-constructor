const getRemainingAmount = require('../../../../app/processing/components/get-remaining-amount')
const scheduleDates = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule-periods')))

describe('get remaining amount', () => {
  test('should return remaining amount as number', () => {
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
  })
})
