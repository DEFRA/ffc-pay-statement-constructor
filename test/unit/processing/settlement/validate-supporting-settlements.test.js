const validateSupportingSettlements = require('../../../../app/processing/settlement/validate-supporting-settlements')
const { SFI_FIRST_PAYMENT, SFI_SECOND_PAYMENT, SFI_THIRD_PAYMENT } = require('../../../mock-components/mock-invoice-number')

describe('validate supporting settlements', () => {
  test('should throw an error when a supporting settlement is missing', () => {
    const completedInvoiceNumbers = [SFI_FIRST_PAYMENT, SFI_SECOND_PAYMENT, SFI_THIRD_PAYMENT]
    const supportingSettlements = [{ invoiceNumber: SFI_FIRST_PAYMENT }, { invoiceNumber: SFI_THIRD_PAYMENT }]
    expect(() => validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)).toThrow()
  })

  test('should throw an error message explaining which supporting settlement is missing', () => {
    const completedInvoiceNumbers = [SFI_FIRST_PAYMENT, SFI_SECOND_PAYMENT, SFI_THIRD_PAYMENT]
    const supportingSettlements = [{ invoiceNumber: SFI_FIRST_PAYMENT }, { invoiceNumber: SFI_THIRD_PAYMENT }]
    expect(() => validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)).toThrow(`Missing supporting settlements for invoice numbers: ${SFI_SECOND_PAYMENT}`)
  })

  test('should throw an error message explaining which supporting settlements are missing if multiple missing', () => {
    const completedInvoiceNumbers = [SFI_FIRST_PAYMENT, SFI_SECOND_PAYMENT, SFI_THIRD_PAYMENT]
    const supportingSettlements = [{ invoiceNumber: SFI_FIRST_PAYMENT }]
    expect(() => validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)).toThrow(`Missing supporting settlements for invoice numbers: ${SFI_SECOND_PAYMENT}, ${SFI_THIRD_PAYMENT}`)
  })

  test('should not throw an error when all supporting settlements are present', () => {
    const completedInvoiceNumbers = [SFI_FIRST_PAYMENT, SFI_SECOND_PAYMENT, SFI_THIRD_PAYMENT]
    const supportingSettlements = [{ invoiceNumber: SFI_FIRST_PAYMENT }, { invoiceNumber: SFI_SECOND_PAYMENT }, { invoiceNumber: SFI_THIRD_PAYMENT }]
    expect(() => validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)).not.toThrow()
  })

  test('should throw an error when there are no supporting settlements', () => {
    const completedInvoiceNumbers = [SFI_FIRST_PAYMENT, SFI_SECOND_PAYMENT, SFI_THIRD_PAYMENT]
    const supportingSettlements = []
    expect(() => validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)).toThrow()
  })

  test('should not throw an error when there are no completed invoice numbers', () => {
    const completedInvoiceNumbers = []
    const supportingSettlements = [{ invoiceNumber: SFI_FIRST_PAYMENT }, { invoiceNumber: SFI_SECOND_PAYMENT }, { invoiceNumber: SFI_THIRD_PAYMENT }]
    expect(() => validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)).not.toThrow()
  })

  test('should not throw an error when there are no completed invoice numbers and no supporting settlements', () => {
    const completedInvoiceNumbers = []
    const supportingSettlements = []
    expect(() => validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)).not.toThrow()
  })
})
