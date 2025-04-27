const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserHistory = sequelize.define('UserHistory', {
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
    allowNull: false,
    references: {
      model: 'tracks',
      key: 'id'
    }
  },
  playedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds that the track was played'
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether the track was played to completion'
  },
  deviceInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Information about the device used to play the track'
  }
}, {
  tableName: 'user_history',
  timestamps: true,
  underscored: true
});

module.exports = UserHistory; 