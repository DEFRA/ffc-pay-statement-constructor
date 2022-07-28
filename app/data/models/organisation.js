module.exports = (sequelize, DataTypes) => {
  const organisation = sequelize.define('organisation', {
    sbi: { type: DataTypes.INTEGER, primaryKey: true },
    address: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    name: DataTypes.STRING
  },
  {
    tableName: 'organisations',
    freezeTableName: true,
    timestamps: false
  })
  return organisation
}
