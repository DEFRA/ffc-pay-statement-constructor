const processStatementMessage = async (message, receiver) => {
  try {
    await receiver.completeMessage(message)
    console.log(message.body)
  } catch (err) {
    console.error('Unable to process statement message:', err)
  }
}

module.exports = processStatementMessage
