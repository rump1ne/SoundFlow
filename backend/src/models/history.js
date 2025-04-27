const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const History = sequelize.define('History', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    trackId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    playedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    }
  });

  return History;
}; 