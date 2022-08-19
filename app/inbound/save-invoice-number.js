const db = require('../data')
const reverseEngineerInvoiceNumber = require('../processing/reverse-engineer-invoice-number')

const saveInvoiceNumber = async (invoiceNumber, transaction) => {
  await db.invoiceNumber.create({
    invoiceNumber,
    originalInvoiceNumber: reverseEngineerInvoiceNumber(invoiceNumber)
  },
  { transaction }
  )
}

module.exports = saveInvoiceNumber
