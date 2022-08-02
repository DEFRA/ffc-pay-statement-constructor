module.exports = (sequelize, DataTypes) => {
  const schedule = sequelize.define('schedule', {
    scheduleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    settlementId: DataTypes.INTEGER,
    completed: DataTypes.DATE,
    planned: DataTypes.DATE,
    started: DataTypes.DATE
  },
  {
    tableName: 'schedules',
    freezeTableName: true,
    timestamps: false
  })
  schedule.associate = function (models) {
    schedule.belongsTo(models.settlement, {
      foreignKey: 'settlementId',
      as: 'settlements'
    })
    return schedule
  }
}
