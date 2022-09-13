
const util = require('util')
const createMessage = require('../../messaging/create-message')

const publishStatement = async (statement, statementSender) => {
  const message = createMessage(statement, 'uk.gov.pay.statement')
  await statementSender.sendMessage(message)
  console.log('Statement sent:', util.inspect(message, false, null, true))
}

module.exports = publishStatement
