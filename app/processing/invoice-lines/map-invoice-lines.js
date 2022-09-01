
const mapInvoiceLines = (invoiceLines) => {
  const annualValue = invoiceLines.find(invoiceLine => invoiceLine.description === 'G00 - Gross value of claim').value
  const reductionsArray = invoiceLines.filter(invoiceLine => invoiceLine.description === 'Over declaration reduction')
  const totalReductions = reductionsArray.reduce() // add all the reduction values
  console.log(annualValue)
  console.log(reductionsArray)
  
  const output = {
    annualValue: '',
    quarterlyPayment: '',
    quarterlyReduction: '',
    quarterlyValue: '',
    fundingCode: '',
    reductions: [{
      reason: '',
      value: ''
    }]
  }
}
module.exports = mapInvoiceLines
