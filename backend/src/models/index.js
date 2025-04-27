const { Sequelize } = require('sequelize');
const config = require('../config/database');

let sequelize;

// Check if using connection URL (Railway format)
if (config.url) {
  sequelize = new Sequelize(config.url, {
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  // Use individual connection parameters
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect || 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: true
      }
    }
  );
}

// Initialize models
const models = {
  User: require('./User')(sequelize),
  Track: require('./Track')(sequelize),
  Playlist: require('./Playlist')(sequelize),
  Favorite: require('./Favorite')(sequelize),
  History: require('./History')(sequelize),
  Comment: require('./Comment')(sequelize),
  PlaylistTrack: require('./PlaylistTrack')(sequelize),
  Album: require('./Album')(sequelize),
  Artist: require('./Artist')(sequelize),
  Genre: require('./Genre')(sequelize),
  Notification: require('./Notification')(sequelize),
  Follow: require('./Follow')(sequelize),
  Collaborator: require('./Collaborator')(sequelize),
  PlaylistShare: require('./PlaylistShare')(sequelize),
  Rating: require('./Rating')(sequelize)
};

// Define associations
const { User, Track, Playlist, Favorite, History, Comment, PlaylistTrack, Album, Artist, Genre, Notification, Follow, Collaborator, PlaylistShare, Rating } = models;

User.hasMany(Playlist, { foreignKey: 'userId', as: 'playlists' });
Playlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Playlist.belongsToMany(Track, { through: PlaylistTrack, as: 'tracks' });
Track.belongsToMany(Playlist, { through: PlaylistTrack, as: 'playlists' });

User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Track, { foreignKey: 'favoriteId', as: 'track', constraints: false });
Favorite.belongsTo(Playlist, { foreignKey: 'favoriteId', as: 'playlist', constraints: false });

User.hasMany(History, { foreignKey: 'userId', as: 'history' });
History.belongsTo(User, { foreignKey: 'userId', as: 'user' });
History.belongsTo(Track, { foreignKey: 'trackId', as: 'track' });

// Comment associations
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Self-referential association for nested comments
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

// Polymorphic associations for comments
Track.hasMany(Comment, { 
  foreignKey: 'commentableId', 
  constraints: false, 
  scope: { commentableType: 'track' },
  as: 'comments'
});
Comment.belongsTo(Track, { 
  foreignKey: 'commentableId', 
  constraints: false,
  as: 'track'
});

Playlist.hasMany(Comment, { 
  foreignKey: 'commentableId', 
  constraints: false, 
  scope: { commentableType: 'playlist' },
  as: 'comments'
});
Comment.belongsTo(Playlist, { 
  foreignKey: 'commentableId', 
  constraints: false,
  as: 'playlist'
});

// Album-Track relationship (one-to-many)
Album.hasMany(Track, {
  foreignKey: 'albumId',
  as: 'tracks'
});
Track.belongsTo(Album, {
  foreignKey: 'albumId',
  as: 'album'
});

// Artist-Track relationship (one-to-many)
Artist.hasMany(Track, {
  foreignKey: 'artistId',
  as: 'tracks'
});
Track.belongsTo(Artist, {
  foreignKey: 'artistId',
  as: 'artist'
});

// Artist-Album relationship (one-to-many)
Artist.hasMany(Album, {
  foreignKey: 'artistId',
  as: 'albums'
});
Album.belongsTo(Artist, {
  foreignKey: 'artistId',
  as: 'artist'
});

// Genre-Track relationship (many-to-many)
Genre.belongsToMany(Track, {
  through: 'TrackGenres',
  foreignKey: 'genreId',
  otherKey: 'trackId',
  as: 'tracks'
});
Track.belongsToMany(Genre, {
  through: 'TrackGenres',
  foreignKey: 'trackId',
  otherKey: 'genreId',
  as: 'genres'
});

// Genre self-referential relationship (parent-child)
Genre.hasMany(Genre, {
  foreignKey: 'parentId',
  as: 'subgenres'
});
Genre.belongsTo(Genre, {
  foreignKey: 'parentId',
  as: 'parent'
});

// User-Notification relationship (one-to-many)
User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications'
});
Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Playlist-Collaborator relationship (one-to-many)
Playlist.hasMany(Collaborator, {
  foreignKey: 'playlistId',
  as: 'collaborators'
});
Collaborator.belongsTo(Playlist, {
  foreignKey: 'playlistId',
  as: 'playlist'
});

// User-Collaborator relationship (one-to-many)
User.hasMany(Collaborator, {
  foreignKey: 'userId',
  as: 'collaborations'
});
Collaborator.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User-Collaborator relationship (added by)
User.hasMany(Collaborator, {
  foreignKey: 'addedBy',
  as: 'addedCollaborators'
});
Collaborator.belongsTo(User, {
  foreignKey: 'addedBy',
  as: 'addedByUser'
});

// Playlist-PlaylistShare relationship (one-to-many)
Playlist.hasMany(PlaylistShare, {
  foreignKey: 'playlistId',
  as: 'shares'
});
PlaylistShare.belongsTo(Playlist, {
  foreignKey: 'playlistId',
  as: 'playlist'
});

// User-PlaylistShare relationship (created by)
User.hasMany(PlaylistShare, {
  foreignKey: 'createdBy',
  as: 'createdShares'
});
PlaylistShare.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// Rating associations
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Polymorphic associations for ratings
Track.hasMany(Rating, { 
  foreignKey: 'rateableId', 
  constraints: false, 
  scope: { rateableType: 'track' },
  as: 'ratings'
});
Rating.belongsTo(Track, { 
  foreignKey: 'rateableId', 
  constraints: false,
  as: 'track'
});

Playlist.hasMany(Rating, { 
  foreignKey: 'rateableId', 
  constraints: false, 
  scope: { rateableType: 'playlist' },
  as: 'ratings'
});
Rating.belongsTo(Playlist, { 
  foreignKey: 'rateableId', 
  constraints: false,
  as: 'playlist'
});

// User-Follow relationships (self-referential many-to-many)
User.belongsToMany(User, {
  through: Follow,
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});
User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

// Export models and sequelize instance
module.exports = { sequelize, ...models }; 