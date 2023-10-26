const getScheme = require('../../../../app/processing/components/get-scheme')

const mockYear = require('../../../mock-components/mock-marketing-year')
const mockFrequency = 'frequency'
const mockAgreementNumber = require('../../../mock-components/mock-agreement-number').SFI
const mockSourceSystem = 'SFIA'

describe('get scheme', () => {
  test('should return name as Sustainable Farming Incentive 2023', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber, mockSourceSystem)
    expect(scheme.name).toBe('Sustainable Farming Incentive 2023')
  })

  test('should return short name as SFIA', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber, mockSourceSystem)
    expect(scheme.shortName).toBe('SFIA')
  })

  test('should return year as string', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber, mockSourceSystem)
    expect(typeof scheme.year).toBe('string')
  })

  test('should return frequency as string', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber, mockSourceSystem)
    expect(typeof scheme.frequency).toBe('string')
  })

  test('should return agreement number as string', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber, mockSourceSystem)
    expect(typeof scheme.agreementNumber).toBe('string')
  })
})
