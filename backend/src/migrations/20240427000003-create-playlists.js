'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Playlists table
    await queryInterface.createTable('Playlists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Create PlaylistTracks junction table
    await queryInterface.createTable('PlaylistTracks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      playlistId: {
        type: Sequelize.UUID,
        references: {
          model: 'Playlists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      trackId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tracks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    // Add index for playlist track ordering
    await queryInterface.addIndex('PlaylistTracks', ['playlistId', 'position'], {
      unique: true,
      name: 'playlist_track_position_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PlaylistTracks');
    await queryInterface.dropTable('Playlists');
  }
};