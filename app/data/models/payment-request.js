module.exports = (sequelize, DataTypes) => {
  const paymentRequest = sequelize.define('paymentRequest', {
    paymentRequestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    agreementNumber: DataTypes.STRING,
    contractNumber: DataTypes.STRING,
    correlationId: DataTypes.UUID,
    currency: DataTypes.STRING,
    deliveryBody: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    marketingYear: DataTypes.INTEGER,
    referenceId: DataTypes.UUID,
    schedule: DataTypes.STRING,
    sitiAgriInvoiceNumber: DataTypes.STRING,
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
    paymentRequest.hasOne(models.claim, {
      foreignKey: 'paymentRequestId',
      as: 'claims'
    })
    return paymentRequest
  }
}
