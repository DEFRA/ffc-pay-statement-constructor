const reverseEngineerInvoiceNumber = (invoiceNumber) => {
  return `original${invoiceNumber.slice(0, 5)}`
}

module.exports = reverseEngineerInvoiceNumber
