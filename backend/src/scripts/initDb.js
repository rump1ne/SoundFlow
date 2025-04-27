require('dotenv').config();
const { sequelize, User, Artist, Album, Track, Playlist, Favorite, History, Comment, PlaylistTrack, Genre, Notification, Follow, Collaborator, PlaylistShare, Rating } = require('../models');

async function initializeDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    // Note: In production, you should use migrations instead of sync
    const force = process.env.NODE_ENV === 'development' && process.argv.includes('--force');
    const alter = process.env.NODE_ENV === 'development' && process.argv.includes('--alter');
    
    if (force) {
      console.log('Dropping all tables and recreating them...');
    } else if (alter) {
      console.log('Altering existing tables...');
    } else {
      console.log('Creating tables if they do not exist...');
    }

    // Create tables in the correct order
    await User.sync({ force, alter });
    await Artist.sync({ force, alter });
    await Album.sync({ force, alter });
    await Track.sync({ force, alter });
    await Playlist.sync({ force, alter });
    await PlaylistTrack.sync({ force, alter });
    await Favorite.sync({ force, alter });
    await History.sync({ force, alter });
    await Comment.sync({ force, alter });
    await Genre.sync({ force, alter });
    await Notification.sync({ force, alter });
    await Follow.sync({ force, alter });
    await Collaborator.sync({ force, alter });
    await PlaylistShare.sync({ force, alter });
    await Rating.sync({ force, alter });

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 