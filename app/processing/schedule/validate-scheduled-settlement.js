const schema = require('./schema')

const validateScheduledSettlement = (scheduledSettlement) => {
  try {
    const result = schema.validate(scheduledSettlement, {
      abortEarly: false
    })

    if (result.error) {
      throw new Error(`Schedule with scheduleId: ${scheduledSettlement.scheduleId} does not have the required data: ${result.error.message}`)
    }

    return result.value
  } catch (error) {
    throw new Error('Could not validate: ', scheduledSettlement)
  }
}

module.exports = validateScheduledSettlement
