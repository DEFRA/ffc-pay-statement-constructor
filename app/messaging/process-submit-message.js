const processSubmitMessage = async (message, receiver) => {
  try {
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process submit message:', err)
  }
}

module.exports = processSubmitMessage
