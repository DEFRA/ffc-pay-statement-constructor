jest.mock('ffc-messaging')
const processReturnMessage = require('../../../app/messaging/process-return-message')
let receiver

describe('process return message', () => {
  beforeEach(() => {
    receiver = {
      completeMessage: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('completes message', async () => {
    const message = {
      body: {
        sourceSystem: 'SITIAgri',
        invoiceNumber: 'S123456789A123456V003',
        frn: 1234567890,
        currency: 'GBP',
        value: 30000,
        settlementDate: 'Fri Jan 21 2022 10:38:44 GMT+0000 (Greenwich Mean Time)',
        reference: 'PY1234567',
        settled: true
      }
    }
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
