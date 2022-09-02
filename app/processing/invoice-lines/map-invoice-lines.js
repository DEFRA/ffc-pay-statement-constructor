const groupInvoiceLinesByFundingCode = require('./group-invoice-lines-by-funding-code')
const mapInvoiceLineReductions = require('./map-invoice-line-reductions')
const calculateTotalReduction = require('./calculate-total-reduction')

const mapInvoiceLines = (invoiceLines) => {
  const invoiceLinesGroupedByFundingCode = groupInvoiceLinesByFundingCode(invoiceLines)
  const fundingCode = invoiceLinesGroupedByFundingCode[0][0].fundingCode

  const mappedInvoiceLinesArray = invoiceLinesGroupedByFundingCode.map(invoiceLineGroup => {
    const annualValue = invoiceLineGroup.find(invoiceLine => invoiceLine.description === 'G00 - Gross value of claim').value
    const reductions = mapInvoiceLineReductions(invoiceLineGroup)
    const totalReduction = calculateTotalReduction(reductions)

    return {
      annualValue,
      fundingCode,
      reductions,
      quarterlyValue: annualValue / 4,
      quarterlyPayment: (annualValue - totalReduction) / 4,
      quarterlyReduction: totalReduction / 4
    }
  })
  return mappedInvoiceLinesArray
}
module.exports = mapInvoiceLines
