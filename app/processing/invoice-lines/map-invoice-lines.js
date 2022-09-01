const groupInvoiceLinesByFundingCode = require('./group-invoice-lines-by-funding-code')
const mapInvoiceLines = (invoiceLines) => {
  const invoiceLinesGroupedByFundingCode = groupInvoiceLinesByFundingCode(invoiceLines)
  invoiceLinesGroupedByFundingCode.map(invoiceLineGroup => {
    const annualPayment = invoiceLineGroup.filter(invoiceLine => invoiceLine.description === 'G00 - Gross value of claim')
    console.log(annualPayment)
    return {
      annualPayment
    }
  })
}
module.exports = mapInvoiceLines

// for each group we want to:
  // get the total value
  // get the total reductions
  // complete teh output object
  // push to array