const groupInvoiceLinesByFundingCode = (invoiceLines) => {
  // return array of all unique fundingCodes
  const invoiceLineFundingCodes = [...new Set(invoiceLines.map(invoiceLine => invoiceLine.fundingCode))]

  // group all the invoiceLines belonging to a particular fundingCode
  const invoiceLinesGroupedByFundingCode = invoiceLineFundingCodes.map(
    fundingCode => invoiceLines.filter(invoiceLine => invoiceLine.fundingCode === fundingCode)
  )
  return invoiceLinesGroupedByFundingCode
}
module.exports = groupInvoiceLinesByFundingCode
