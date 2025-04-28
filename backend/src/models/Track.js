const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Track = sequelize.define('Track', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      }
    },
    albumId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Albums',
        key: 'id'
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    coverArt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    plays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Track.associate = (models) => {
    Track.belongsTo(models.Artist, {
      foreignKey: 'artistId',
      as: 'artist'
    });
    Track.belongsTo(models.Album, {
      foreignKey: 'albumId',
      as: 'album'
    });
  };

  return Track;
}; 