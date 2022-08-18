module.exports = (sequelize, DataTypes) => {
  const paymentRequest = sequelize.define('paymentRequest', {
    paymentRequestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceNumber: DataTypes.STRING,
    schemeId: DataTypes.INTEGER,
    agreementNumber: DataTypes.STRING,
    contractNumber: DataTypes.STRING,
    correlationId: DataTypes.UUID,
    currency: DataTypes.STRING,
    deliveryBody: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    marketingYear: DataTypes.INTEGER,
    received: DataTypes.DATE,
    referenceId: DataTypes.UUID,
    schedule: DataTypes.STRING,
    status: DataTypes.STRING,
    submitted: DataTypes.DATE,
    value: DataTypes.INTEGER
  },
  {
    tableName: 'paymentRequests',
    freezeTableName: true,
    timestamps: false
  })
  paymentRequest.associate = function (models) {
    paymentRequest.hasMany(models.invoiceLine, {
      foreignKey: 'paymentRequestId',
      as: 'invoiceLines'
    })
    paymentRequest.hasMany(models.settlement, {
      foreignKey: 'paymentRequestId',
      as: 'settlements'
    })
    paymentRequest.hasOne(models.calculation, {
      foreignKey: 'paymentRequestId',
      as: 'calculations'
    })
    paymentRequest.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'schemes'
    })
    paymentRequest.belongsTo(models.invoiceNumber, {
      foreignKey: 'invoiceNumber',
      as: 'invoiceNumbers'
    })
  }
  return paymentRequest
}
