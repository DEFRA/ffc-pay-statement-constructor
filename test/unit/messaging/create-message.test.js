const createMessage = require('../../../app/messaging/create-message')
const body = {
  content: 'hello'
}
const type = 'message'

describe('create message', () => {
  test('includes body', () => {
    const result = createMessage(body, type)
    expect(result.body).toStrictEqual(body)
  })

  test('includes type', () => {
    const result = createMessage(body, type)
    expect(result.type).toBe('message')
  })

  test('includes source', () => {
    const result = createMessage(body, type)
    expect(result.source).toBe('ffc-pay-statement-constructor')
  })
})
