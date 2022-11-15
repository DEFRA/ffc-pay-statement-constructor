const validateStatement = (statement) => {
  const hasValue = hasPaymentValue(statement.payment)
  return hasValue
}

const hasPaymentValue = (payment) => {
  const hasPaymentValue = payment.value > 0

  if (!hasPaymentValue) {
    console.log(`Skipping construction of zero value payment for ${payment.invoiceNumber}`)
    return false
  }
  return true
}

module.exports = validateStatement
