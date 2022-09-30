const { convertToPounds } = require('../../../app/utility')

describe('convert integer pence to string decimal pounds', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return "567.89" when 56789 is given', async () => {
    const result = await convertToPounds(56789)
    expect(result).toBe('567.89')
  })
})
