const { Track, User, History, Favorite, Playlist, Rating, Artist, Genre, Album, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get personalized track recommendations for a user
exports.getTrackRecommendations = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const userId = req.user.id;
    
    // Get user's favorite genres and artists from their history and favorites
    const userHistory = await History.findAll({
      where: { userId },
      include: [
        { 
          model: Track, 
          as: 'track',
          include: [
            { model: Artist, as: 'artist' },
            { model: Genre, as: 'genres' }
          ]
        }
      ],
      limit: 100,
      order: [['createdAt', 'DESC']]
    });
    
    const userFavorites = await Favorite.findAll({
      where: { userId },
      include: [
        { 
          model: Track, 
          as: 'track',
          include: [
            { model: Artist, as: 'artist' },
            { model: Genre, as: 'genres' }
          ]
        }
      ],
      limit: 100
    });
    
    // Extract genres and artists from history and favorites
    const genres = new Set();
    const artists = new Set();
    
    [...userHistory, ...userFavorites].forEach(item => {
      const track = item.track;
      if (track) {
        if (track.artist) {
          artists.add(track.artist.id);
        }
        if (track.genres && track.genres.length > 0) {
          track.genres.forEach(genre => genres.add(genre.id));
        }
      }
    });
    
    // Get tracks from similar genres and artists
    const recommendedTracks = await Track.findAll({
      where: {
        id: {
          [Op.notIn]: [...userHistory.map(h => h.trackId), ...userFavorites.map(f => f.trackId)]
        },
        [Op.or]: [
          { artistId: { [Op.in]: Array.from(artists) } },
          { '$genres.id$': { [Op.in]: Array.from(genres) } }
        ]
      },
      include: [
        { model: Artist, as: 'artist' },
        { model: Genre, as: 'genres' },
        { model: Album, as: 'album' }
      ],
      limit: parseInt(limit),
      order: sequelize.literal('RANDOM()')
    });
    
    // If not enough recommendations, add popular tracks
    if (recommendedTracks.length < limit) {
      const popularTracks = await Track.findAll({
        where: {
          id: {
            [Op.notIn]: [...recommendedTracks.map(t => t.id), ...userHistory.map(h => h.trackId), ...userFavorites.map(f => f.trackId)]
          }
        },
        include: [
          { model: Artist, as: 'artist' },
          { model: Genre, as: 'genres' },
          { model: Album, as: 'album' }
        ],
        limit: parseInt(limit) - recommendedTracks.length,
        order: [['playCount', 'DESC']]
      });
      
      recommendedTracks.push(...popularTracks);
    }
    
    res.json(recommendedTracks);
  } catch (error) {
    console.error('Error getting track recommendations:', error);
    res.status(500).json({ message: 'Error getting track recommendations' });
  }
};

// Get personalized playlist recommendations for a user
exports.getPlaylistRecommendations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;
    
    // Get user's favorite genres and artists
    const userFavorites = await Favorite.findAll({
      where: { userId },
      include: [
        { 
          model: Track, 
          as: 'track',
          include: [
            { model: Artist, as: 'artist' },
            { model: Genre, as: 'genres' }
          ]
        }
      ],
      limit: 100
    });
    
    // Extract genres and artists from favorites
    const genres = new Set();
    const artists = new Set();
    
    userFavorites.forEach(item => {
      const track = item.track;
      if (track) {
        if (track.artist) {
          artists.add(track.artist.id);
        }
        if (track.genres && track.genres.length > 0) {
          track.genres.forEach(genre => genres.add(genre.id));
        }
      }
    });
    
    // Get playlists from similar genres and artists
    const recommendedPlaylists = await Playlist.findAll({
      where: {
        id: {
          [Op.notIn]: userFavorites.filter(f => f.favoriteType === 'playlist').map(f => f.favoriteId)
        },
        isPublic: true,
        userId: {
          [Op.ne]: userId
        },
        [Op.or]: [
          { '$tracks.artistId$': { [Op.in]: Array.from(artists) } },
          { '$tracks.genres.id$': { [Op.in]: Array.from(genres) } }
        ]
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
        { 
          model: Track, 
          as: 'tracks',
          include: [
            { model: Artist, as: 'artist' },
            { model: Genre, as: 'genres' }
          ],
          limit: 5
        }
      ],
      limit: parseInt(limit),
      order: sequelize.literal('RANDOM()')
    });
    
    // If not enough recommendations, add popular playlists
    if (recommendedPlaylists.length < limit) {
      const popularPlaylists = await Playlist.findAll({
        where: {
          id: {
            [Op.notIn]: [...recommendedPlaylists.map(p => p.id), ...userFavorites.filter(f => f.favoriteType === 'playlist').map(f => f.favoriteId)]
          },
          isPublic: true,
          userId: {
            [Op.ne]: userId
          }
        },
        include: [
          { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
          { 
            model: Track, 
            as: 'tracks',
            include: [
              { model: Artist, as: 'artist' },
              { model: Genre, as: 'genres' }
            ],
            limit: 5
          }
        ],
        limit: parseInt(limit) - recommendedPlaylists.length,
        order: [['playCount', 'DESC']]
      });
      
      recommendedPlaylists.push(...popularPlaylists);
    }
    
    res.json(recommendedPlaylists);
  } catch (error) {
    console.error('Error getting playlist recommendations:', error);
    res.status(500).json({ message: 'Error getting playlist recommendations' });
  }
};

// Get personalized artist recommendations for a user
exports.getArtistRecommendations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;
    
    // Get user's favorite artists from history and favorites
    const userHistory = await History.findAll({
      where: { userId },
      include: [
        { 
          model: Track, 
          as: 'track',
          include: [{ model: Artist, as: 'artist' }]
        }
      ],
      limit: 100,
      order: [['createdAt', 'DESC']]
    });
    
    const userFavorites = await Favorite.findAll({
      where: { userId },
      include: [
        { 
          model: Track, 
          as: 'track',
          include: [{ model: Artist, as: 'artist' }]
        }
      ],
      limit: 100
    });
    
    // Extract artists from history and favorites
    const artists = new Set();
    
    [...userHistory, ...userFavorites].forEach(item => {
      const track = item.track;
      if (track && track.artist) {
        artists.add(track.artist.id);
      }
    });
    
    // Get similar artists based on genre overlap
    const recommendedArtists = await Artist.findAll({
      where: {
        id: {
          [Op.notIn]: Array.from(artists)
        }
      },
      include: [
        { 
          model: Track,
          as: 'tracks',
          include: [{ model: Genre, as: 'genres' }],
          limit: 5
        }
      ],
      limit: parseInt(limit),
      order: [['monthlyListeners', 'DESC']]
    });
    
    res.json(recommendedArtists);
  } catch (error) {
    console.error('Error getting artist recommendations:', error);
    res.status(500).json({ message: 'Error getting artist recommendations' });
  }
};

// Get similar tracks to a specific track
exports.getSimilarTracks = async (req, res) => {
  try {
    const { trackId } = req.params;
    const { limit = 10 } = req.query;
    
    // Get the track with its artist and genres
    const track = await Track.findByPk(trackId, {
      include: [
        { model: Artist, as: 'artist' },
        { model: Genre, as: 'genres' }
      ]
    });
    
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    
    // Get tracks with similar artist or genres
    const similarTracks = await Track.findAll({
      where: {
        id: {
          [Op.ne]: trackId
        },
        [Op.or]: [
          { artistId: track.artistId },
          { '$genres.id$': { [Op.in]: track.genres.map(g => g.id) } }
        ]
      },
      include: [
        { model: Artist, as: 'artist' },
        { model: Genre, as: 'genres' },
        { model: Album, as: 'album' }
      ],
      limit: parseInt(limit),
      order: sequelize.literal('RANDOM()')
    });
    
    res.json(similarTracks);
  } catch (error) {
    console.error('Error getting similar tracks:', error);
    res.status(500).json({ message: 'Error getting similar tracks' });
  }
}; 