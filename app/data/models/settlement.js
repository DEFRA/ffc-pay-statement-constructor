module.exports = (sequelize, DataTypes) => {
  const settlement = sequelize.define('settlement', {
    settlementId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    detail: DataTypes.STRING,
    invalid: DataTypes.BOOLEAN,
    generated: DataTypes.BOOLEAN,
    frn: DataTypes.INTEGER,
    invoiceNumber: DataTypes.STRING,
    ledger: DataTypes.STRING,
    reference: DataTypes.STRING,
    settled: DataTypes.BOOLEAN,
    settlementDate: DataTypes.DATE,
    sourceSystem: DataTypes.STRING,
    value: DataTypes.INTEGER
  },
  {
    tableName: 'settlements',
    freezeTableName: true,
    timestamps: false
  })
  settlement.associate = function (models) {
    settlement.hasOne(models.schedule, {
      foreignKey: 'settlementId',
      as: 'schedules'
    })
    settlement.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequests'
    })
  }
  return settlement
}
