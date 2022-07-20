const processReturnMessage = async (message, receiver) => {
  try {
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process return message:', err)
  }
}

module.exports = processReturnMessage
