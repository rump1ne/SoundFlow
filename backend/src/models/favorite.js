const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    favoriteType: {
      type: DataTypes.ENUM('track', 'playlist'),
      allowNull: false
    },
    favoriteId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });

  return Favorite;
}; 