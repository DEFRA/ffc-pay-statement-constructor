const groupInvoiceLinesByFundingCode = require('./group-invoice-lines-by-funding-code')
const mapInvoiceLines = (invoiceLines) => {
  const invoiceLinesGroupedByFundingCode = groupInvoiceLinesByFundingCode(invoiceLines)
}
module.exports = mapInvoiceLines
