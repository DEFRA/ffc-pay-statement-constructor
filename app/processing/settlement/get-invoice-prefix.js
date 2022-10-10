const getInvoicePrefix = (invoiceNumber) => {
  return invoiceNumber.substring(0, 8)
}

module.exports = getInvoicePrefix
