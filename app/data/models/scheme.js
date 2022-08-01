module.exports = (sequelize, DataTypes) => {
  const scheme = sequelize.define('scheme', {
    schemeCode: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true },
    calculationId: DataTypes.INTEGER,
    areaClaimed: DataTypes.DECIMAL
  },
  {
    tableName: 'schemes',
    freezeTableName: true,
    timestamps: false
  })
  scheme.associate = function (models) {
    scheme.hasMany(models.invoiceLine, {
      foreignKey: 'schemeCode',
      as: 'invoiceLines'
    })
    scheme.belongsTo(models.claim, {
      foreignKey: 'calculationId',
      as: 'claims'
    })
    return scheme
  }
}
