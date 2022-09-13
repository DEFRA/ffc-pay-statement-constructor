const { convertToPence, convertToPounds, reverseInvoiceNumber } = require('../../app/utility')

describe('test utility components', () => {
  test('test convert to pence', async () => {
    const poundsValue = 12.56
    const penceValue = convertToPence(poundsValue)
    expect(penceValue).toBe(1256)
  })

  test('test convert to pounds', async () => {
    const penceValue = 56789
    const poundsValue = convertToPounds(penceValue)
    expect(poundsValue).toBe('567.89')
  })

  test('test reverse invoice number', async () => {
    const originalInvoiceNumber = 'S000000100000001V001'
    const reversedInvoinceNumber = reverseInvoiceNumber(originalInvoiceNumber)
    expect(reversedInvoinceNumber).toBe('SFI0000001')
  })
})
