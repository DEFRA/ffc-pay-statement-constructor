const processProcessingMessage = async (message, receiver) => {
  try {
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process processing message:', err)
  }
}

module.exports = processProcessingMessage
