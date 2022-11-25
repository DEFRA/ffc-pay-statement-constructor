jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')
jest.mock('../../app/storage')
const mockStorage = require('../../app/storage')
jest.mock('../../app/messaging/wait-for-idle-messaging')

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
