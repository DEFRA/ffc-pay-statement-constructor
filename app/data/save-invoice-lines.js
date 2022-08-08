const db = require('.')

const saveInvoiceLines = async (invoiceLines, paymentRequestId, transaction) => {
  for (const invoiceLine of invoiceLines) {
    delete invoiceLine.invoiceLineId
    invoiceLine.fundingCode = invoiceLine.schemeCode
    await db.invoiceLine.create({ ...invoiceLine, paymentRequestId }, { transaction })
  }
}

module.exports = saveInvoiceLines
