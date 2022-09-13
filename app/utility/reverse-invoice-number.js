const reverseInvoiceNumber = (invoiceNumber) => {
  const firstPart = 'SFI'
  const secondPart = invoiceNumber.slice(1, 8)
  return firstPart.concat(secondPart)
}

module.exports = reverseInvoiceNumber
