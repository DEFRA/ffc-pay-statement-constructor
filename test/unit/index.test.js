jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')
const mockStorage = require('../../app/storage')

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts messaging', async () => {
    expect(mockMessaging.start).toHaveBeenCalled()
  })

  test('initialises containers', async () => {
    expect(mockStorage.initialiseContainers).toHaveBeenCalled()
  })
})
