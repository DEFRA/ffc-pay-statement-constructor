const db = require('.')

const updateInvoiceLines = async (invoiceLines, paymentRequestId, transaction) => {
  for (const invoiceLine of invoiceLines) {
    delete invoiceLine.invoiceLineId
    invoiceLine.fundingCode = invoiceLine.schemeCode
    await db.invoiceLine.update({ invoiceLine },
      { where: { paymentRequestId } },
      { transaction })
  }
}

module.exports = updateInvoiceLines
