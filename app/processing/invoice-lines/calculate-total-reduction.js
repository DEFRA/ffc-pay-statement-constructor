const calculateTotalReduction = (reductions) => {
  const totalReduction = reductions.reduce((total, reduction) => {
    const value = total += reduction.value
    return value
  }, 0)
  return totalReduction
}

module.exports = calculateTotalReduction
