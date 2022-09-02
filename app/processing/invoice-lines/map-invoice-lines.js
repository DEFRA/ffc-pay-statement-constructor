const groupInvoiceLinesByFundingCode = require('./group-invoice-lines-by-funding-code')
const mapInvoiceLines = (invoiceLines) => {
  const invoiceLinesGroupedByFundingCode = groupInvoiceLinesByFundingCode(invoiceLines)
  const fundingCode = invoiceLinesGroupedByFundingCode[0][0].fundingCode
  const output = invoiceLinesGroupedByFundingCode.map(invoiceLineGroup => {
    const annualValue = invoiceLineGroup.find(invoiceLine => invoiceLine.description === 'G00 - Gross value of claim').value

    const reductions = invoiceLineGroup.filter(invoiceLine => invoiceLine.description === 'Over declaration reduction').map(reduction => {
      const reductionObject = {
        reason: reduction.description,
        value: reduction.value
      }
      return reductionObject
    })
    const totalReduction = reductions.reduce((total, reduction) => { return total += reduction.value }, 0)

    return {
      annualValue,
      fundingCode,
      reductions,
      quarterlyValue: annualValue / 4,
      quarterlyPayment: (annualValue - totalReduction) / 4,
      quarterlyReduction: totalReduction / 4
    }
  })
  console.log(output)
}
module.exports = mapInvoiceLines

// for each group we want to:
  // get the total value
  // get the total reductions
  // complete teh output object
  // push to array