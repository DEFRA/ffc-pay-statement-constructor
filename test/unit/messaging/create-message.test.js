const createMessage = require('../../../app/messaging/create-message')
const body = {
  content: 'hello'
}
const type = 'message'
const config = {
  source: 'ffc-pay-statement-constructor'
}

describe('create message', () => {
  test('includes body', () => {
    const result = createMessage(body, type, config)
    expect(result.body).toStrictEqual(body)
  })

  test('includes type', () => {
    const result = createMessage(body, type, config)
    expect(result.type).toBe('message')
  })

  test('includes source', () => {
    const result = createMessage(body, type, config)
    expect(result.source).toBe('ffc-pay-statement-constructor')
  })
})
