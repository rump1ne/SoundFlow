const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Follow = sequelize.define('Follow', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'follows',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['follower_id', 'following_id']
      },
      {
        fields: ['follower_id']
      },
      {
        fields: ['following_id']
      }
    ]
  });

  return Follow;
}; 