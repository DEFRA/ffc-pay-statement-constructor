
const getDetailedPayments = async (calculation, paymentRequest, settlement) => {
  const payments = []

  const payment = {
    invoiceNumber: calculation.invoiceNumber,
    reference: settlement.reference,
    dueDate: paymentRequest.dueDate,
    settled: settlement.settled,
    calculated: calculation.calculated,
    value: paymentRequest.value
  }
  payments.push(payment)

  return payments
}

module.exports = getDetailedPayments
