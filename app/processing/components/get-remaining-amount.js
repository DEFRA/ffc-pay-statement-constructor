const getRemainingAmount = (scheduleDates) => {
  return scheduleDates.reduce((remainingAmount, schedule) => remainingAmount + Number(schedule.value), 0)
}

module.exports = getRemainingAmount
