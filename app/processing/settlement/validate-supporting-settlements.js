const validateSupportingSettlements = (completedInvoiceNumbers, supportingSettlements) => {
  const supportingSettlementInvoiceNumbers = supportingSettlements.map(s => s.invoiceNumber)
  const missingInvoiceNumbers = completedInvoiceNumbers.filter(i => !supportingSettlementInvoiceNumbers.includes(i))
  if (missingInvoiceNumbers.length > 0) {
    throw new Error(`Missing supporting settlements for invoice numbers: ${missingInvoiceNumbers.join(', ')}`)
  }
}

module.exports = validateSupportingSettlements
