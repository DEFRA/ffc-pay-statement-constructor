const sleep = require('../../../app/messaging/sleep')

describe('sleep', () => {
  test('should return a promise', () => {
    expect(sleep(1000)).toBeInstanceOf(Promise)
  })

  test('should resolve after the specified time', async () => {
    const start = Date.now()
    await sleep(1000)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(1000)
  })
})
