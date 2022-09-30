const convertToPounds = (valueInPence) => {
  return (valueInPence / 100).toFixed(2)
}

module.exports = convertToPounds
