const moment = require('moment')
const getPeriod = require('../../../../app/processing/payment/calculate-scheduled-payments/get-period')
const scheduleDate = moment('01/01/2022', 'DD/MM/YYYY')

describe('get schedule dates', () => {
  test('Unit of 3 and increment of month must return immediate past three months', () => {
    const threeMonths = getPeriod(scheduleDate, 3, 'month')
    expect(threeMonths).toStrictEqual('Oct-Dec 2021')
  })

  test('Unit of 6 and increment of month must return immediate past six months', () => {
    const threeMonths = getPeriod(scheduleDate, 6, 'month')
    expect(threeMonths).toStrictEqual('Jul-Dec 2021')
  })

  test('Unit of 9 and increment of month must return immediate past nine months', () => {
    const threeMonths = getPeriod(scheduleDate, 9, 'month')
    expect(threeMonths).toStrictEqual('Apr-Dec 2021')
  })

  test('Unit of 12 and increment of week must return immediate past three months', () => {
    const threeMonths = getPeriod(scheduleDate, 12, 'week')
    expect(threeMonths).toStrictEqual('Oct-Dec 2021')
  })
})
