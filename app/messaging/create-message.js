const createMessage = async (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-pay-statement-constructor',
    ...options
  }
}

module.exports = createMessage
