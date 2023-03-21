const getPeriod = (scheduleDate, increment, unit) => {
  const firstPeriod = scheduleDate.clone().subtract(increment, unit)
  const lastPeriod = scheduleDate.clone().subtract(1, unit)
  return `${firstPeriod.format('MMM')}-${lastPeriod.format('MMM YYYY')}`
}

module.exports = getPeriod
