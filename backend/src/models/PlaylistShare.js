const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PlaylistShare = sequelize.define('PlaylistShare', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    playlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'playlists',
        key: 'id'
      }
    },
    shareCode: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true
    },
    shareType: {
      type: DataTypes.ENUM('private', 'public', 'password'),
      allowNull: false,
      defaultValue: 'private'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'playlist_shares',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['share_code']
      },
      {
        fields: ['playlist_id']
      },
      {
        fields: ['created_by']
      }
    ]
  });

  return PlaylistShare;
}; 