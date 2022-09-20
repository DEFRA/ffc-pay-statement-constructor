const reverseEngineerInvoiceNumber = (invoiceNumber) => {
  const firstPart = 'SFI'
  const secondPart = invoiceNumber.slice(1, 7)
  return firstPart.concat(secondPart)
}

module.exports = reverseEngineerInvoiceNumber
