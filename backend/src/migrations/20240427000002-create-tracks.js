'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tracks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      spotifyId: {
        type: Sequelize.STRING,
        unique: true
      },
      duration: {
        type: Sequelize.INTEGER
      },
      previewUrl: {
        type: Sequelize.STRING
      },
      popularity: {
        type: Sequelize.INTEGER
      },
      explicit: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      albumId: {
        type: Sequelize.UUID,
        references: {
          model: 'Albums',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      artistId: {
        type: Sequelize.UUID,
        references: {
          model: 'Artists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Audio features
      danceability: {
        type: Sequelize.FLOAT
      },
      energy: {
        type: Sequelize.FLOAT
      },
      key: {
        type: Sequelize.INTEGER
      },
      loudness: {
        type: Sequelize.FLOAT
      },
      mode: {
        type: Sequelize.INTEGER
      },
      tempo: {
        type: Sequelize.FLOAT
      },
      timeSignature: {
        type: Sequelize.INTEGER
      },
      instrumentalness: {
        type: Sequelize.FLOAT
      },
      valence: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tracks');
  }
}; 