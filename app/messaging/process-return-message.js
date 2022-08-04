const { processSubmittedSettlement } = require('../inbound')
const processReturnMessage = async (message, receiver) => {
  try {
    await receiver.completeMessage(message)
    const settlement = message.body
    await processSubmittedSettlement(settlement)
  } catch (err) {
    console.error('Unable to process return message:', err)
  }
}

module.exports = processReturnMessage
