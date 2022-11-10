const isFirstPayment = (invoiceNumber) => {
  return invoiceNumber.endsWith('001')
}

module.exports = isFirstPayment
