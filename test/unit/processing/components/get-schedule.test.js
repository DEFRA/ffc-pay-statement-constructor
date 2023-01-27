const moment = require('moment')
const getSchedule = require('../../../../app/processing/components/get-schedule')
let previousPaymentSchedule
let newPaymentSchedule
let deltaValue

describe('get schedule', () => {
  beforeEach(() => {
    previousPaymentSchedule = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'September to December 2020',
      value: 25000
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: false,
      period: 'January to March 2021',
      value: 25000
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'April to June 2021',
      value: 25000
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'July to September 2021',
      value: 25000
    }]

    newPaymentSchedule = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'September to December 2020',
      value: 50000
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: true,
      period: 'January to March 2021',
      value: 50000
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'April to June 2021',
      value: 50000
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'July to September 2021',
      value: 50000
    }]

    deltaValue = 50000
  })

  test('should return schedule as array', () => {
    const schedule = getSchedule(previousPaymentSchedule, newPaymentSchedule, deltaValue)
    expect(schedule).toEqual(expect.any(Array))
  })

  test('should insert top up adjustment after last outstanding payment in original schedule', () => {
    const schedule = getSchedule(previousPaymentSchedule, newPaymentSchedule, deltaValue)
    expect(schedule[2].period).toEqual('Adjustment')
  })

  test('should retain previous payment value for paid segments', () => {
    const schedule = getSchedule(previousPaymentSchedule, newPaymentSchedule, deltaValue)
    expect(schedule[0].value).toEqual('250.00')
    expect(schedule[1].value).toEqual('250.00')
  })

  test('should calculate new payment value for unpaid segments', () => {
    const schedule = getSchedule(previousPaymentSchedule, newPaymentSchedule, deltaValue)
    expect(schedule[3].value).toEqual('500.00')
    expect(schedule[4].value).toEqual('500.00')
  })

  test('should calculate top up value for adjustment', () => {
    const schedule = getSchedule(previousPaymentSchedule, newPaymentSchedule, deltaValue)
    expect(schedule[2].value).toEqual('250.00')
  })
})
