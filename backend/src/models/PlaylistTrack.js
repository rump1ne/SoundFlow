const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PlaylistTrack = sequelize.define('PlaylistTrack', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    playlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Playlists',
        key: 'id'
      }
    },
    trackId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tracks',
        key: 'id'
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    underscored: true
  });

  return PlaylistTrack;
}; 