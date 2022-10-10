const getLatestPayment = async (paymentRequest, settlement, previousSettlements) => {
  const annualValue = paymentRequest.value
  const previousSettlementsValue = previousSettlements.reduce((acc, settlement) => {
    return acc + settlement.value
  }, 0)
  const settlementValue = settlement.value - previousSettlementsValue

  const period = 

  const latestPayment = {
    invoiceNumber: settlement.invoiceNumber,
    reference: settlement.reference,
    dueDate: paymentRequest.dueDate,
    settled: settlement.settlementDate,
    value: settlementValue,
    period
  }
}

const confirmDueDates = (paymentRequests, previousPaymentRequests, currentDate = new Date()) => {
  // to avoid balloon reduction, any recoveries routed to AP must get a new schedule and due date covering only remaining payments
  // and not include schedules in the past
  const firstPaymentRequest = previousPaymentRequests?.find(x => x.paymentRequestNumber === 1)
  // if payment is not split across schedule no action needed
  if (!firstPaymentRequest?.schedule) {
    return paymentRequests
  }

  const settledValue = getSettledValue(previousPaymentRequests)
  const totalValue = getTotalValue(previousPaymentRequests)
  const paymentSchedule = getPaymentSchedule(firstPaymentRequest.schedule, firstPaymentRequest.dueDate, settledValue, totalValue, currentDate)
  const outstandingSchedule = paymentSchedule.filter(x => x.outstanding)

  // if no payments left in schedule then no action needed
  if (!outstandingSchedule.length) {
    return paymentRequests
  }

  paymentRequests
    .filter(x => x.ledger === AP && x.value < 0)
    .map(paymentRequest => {
      paymentRequest.schedule = `${firstPaymentRequest.schedule.charAt(0)}${outstandingSchedule.length}`
      paymentRequest.dueDate = outstandingSchedule[0].dueDate
      return paymentRequest
    })

  return paymentRequests
}

const getTotalValue = (previousPaymentRequests) => {
  return previousPaymentRequests.filter(x => x.ledger === AP).reduce((x, y) => x + (y.value ?? 0), 0)
}

const getSettledValue = (previousPaymentRequests) => {
  return previousPaymentRequests.filter(x => x.ledger === AP).reduce((x, y) => x + (y.settledValue ?? 0), 0)
}

const getPaymentSchedule = (schedule, dueDate, settledValue, totalValue, currentDate) => {
  const scheduleDate = moment(dueDate, 'DD/MM/YYYY')

  switch (schedule) {
    case Q4:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'month', currentDate)
    case M12:
      return getSchedule(scheduleDate, 12, settledValue, totalValue, 1, 'month', currentDate)
    case T4:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

const getExpectedValue = (totalValue, totalPayments, segment) => {
  return Math.trunc(totalValue / totalPayments * segment)
}

const getSchedule = (scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate) => {
  const scheduleDates = []
  let expectedSettlementValue = 0
  for (let i = 1; i <= totalPayments; i++) {
    expectedSettlementValue = getExpectedValue(totalValue, totalPayments, i)
    const cappedSettlementValue = settledValue <= expectedSettlementValue ? settledValue : expectedSettlementValue
    scheduleDates.push({
      dueDate: scheduleDate.format('DD/MM/YYYY'),
      outstanding: scheduleDate >= currentDate || cappedSettlementValue < expectedSettlementValue
    })
    scheduleDate = scheduleDate.add(increment, unit)
  }
  return scheduleDates
}

const getLatestPeriod = (scheme, latestPayment) => {
  const period = scheme.frequency !== 'Quarterly' ? `${moment(latestPayment.settled, SETTLEMENT_DATE_FORMAT).format('MMMM YYYY')}` : getQuarterlyPeriod(latestPayment.dueDate)
  return period.includes('Invalid date') ? '' : period
}

const getQuarterlyPeriod = (dueDate) => {
  const firstMonth = moment(dueDate, SETTLEMENT_DATE_FORMAT)
  return `${firstMonth.format('MMMM')} to ${firstMonth.add(2, 'months').format('MMMM YYYY')}`
}

module.exports = getLatestPayment
