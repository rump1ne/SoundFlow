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
    artistName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    albumName: {
      type: DataTypes.STRING,
      allowNull: true
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
  });

  return Track;
}; 