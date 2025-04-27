const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Collaborator = sequelize.define('Collaborator', {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('viewer', 'editor', 'admin'),
      allowNull: false,
      defaultValue: 'viewer'
    },
    addedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'collaborators',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['playlist_id', 'user_id']
      },
      {
        fields: ['playlist_id']
      },
      {
        fields: ['user_id']
      }
    ]
  });

  return Collaborator;
}; 