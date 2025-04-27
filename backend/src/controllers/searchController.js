const { Track, Playlist, User, Artist, Album, Genre } = require('../models');
const { Op } = require('sequelize');

// Global search
exports.search = async (req, res) => {
  try {
    const { query, type, page = 1, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const offset = (page - 1) * limit;
    const searchType = type || 'all';
    
    let results = {
      tracks: [],
      playlists: [],
      users: [],
      artists: [],
      albums: [],
      genres: []
    };
    
    // Search tracks
    if (searchType === 'all' || searchType === 'tracks') {
      const tracks = await Track.findAndCountAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } }
          ]
        },
        include: [
          { model: Artist, as: 'artist', attributes: ['id', 'name'] },
          { model: Album, as: 'album', attributes: ['id', 'title', 'coverImage'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      results.tracks = {
        items: tracks.rows,
        total: tracks.count,
        page: parseInt(page),
        totalPages: Math.ceil(tracks.count / limit)
      };
    }
    
    // Search playlists
    if (searchType === 'all' || searchType === 'playlists') {
      const playlists = await Playlist.findAndCountAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } }
          ],
          isPublic: true
        },
        include: [
          { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      results.playlists = {
        items: playlists.rows,
        total: playlists.count,
        page: parseInt(page),
        totalPages: Math.ceil(playlists.count / limit)
      };
    }
    
    // Search users
    if (searchType === 'all' || searchType === 'users') {
      const users = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } }
          ]
        },
        attributes: { exclude: ['password'] },
        limit,
        offset,
        order: [['username', 'ASC']]
      });
      
      results.users = {
        items: users.rows,
        total: users.count,
        page: parseInt(page),
        totalPages: Math.ceil(users.count / limit)
      };
    }
    
    // Search artists
    if (searchType === 'all' || searchType === 'artists') {
      const artists = await Artist.findAndCountAll({
        where: {
          name: { [Op.iLike]: `%${query}%` }
        },
        limit,
        offset,
        order: [['name', 'ASC']]
      });
      
      results.artists = {
        items: artists.rows,
        total: artists.count,
        page: parseInt(page),
        totalPages: Math.ceil(artists.count / limit)
      };
    }
    
    // Search albums
    if (searchType === 'all' || searchType === 'albums') {
      const albums = await Album.findAndCountAll({
        where: {
          title: { [Op.iLike]: `%${query}%` }
        },
        include: [
          { model: Artist, as: 'artist', attributes: ['id', 'name'] }
        ],
        limit,
        offset,
        order: [['title', 'ASC']]
      });
      
      results.albums = {
        items: albums.rows,
        total: albums.count,
        page: parseInt(page),
        totalPages: Math.ceil(albums.count / limit)
      };
    }

    // Search genres
    if (searchType === 'all' || searchType === 'genres') {
      const genres = await Genre.findAndCountAll({
        where: {
          name: { [Op.iLike]: `%${query}%` }
        },
        limit,
        offset,
        order: [['name', 'ASC']]
      });
      
      results.genres = {
        items: genres.rows,
        total: genres.count,
        page: parseInt(page),
        totalPages: Math.ceil(genres.count / limit)
      };
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ message: 'Error performing search' });
  }
};

// Search tracks
exports.searchTracks = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const tracks = await Track.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        { model: Artist, as: 'artist', attributes: ['id', 'name'] },
        { model: Album, as: 'album', attributes: ['id', 'title', 'coverImage'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      items: tracks.rows,
      total: tracks.count,
      page: parseInt(page),
      totalPages: Math.ceil(tracks.count / limit)
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).json({ message: 'Error searching tracks' });
  }
};

// Search playlists
exports.searchPlaylists = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const playlists = await Playlist.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ],
        isPublic: true
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      items: playlists.rows,
      total: playlists.count,
      page: parseInt(page),
      totalPages: Math.ceil(playlists.count / limit)
    });
  } catch (error) {
    console.error('Error searching playlists:', error);
    res.status(500).json({ message: 'Error searching playlists' });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['username', 'ASC']]
    });

    res.json({
      items: users.rows,
      total: users.count,
      page: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
};

// Search artists
exports.searchArtists = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const artists = await Artist.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      },
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    res.json({
      items: artists.rows,
      total: artists.count,
      page: parseInt(page),
      totalPages: Math.ceil(artists.count / limit)
    });
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json({ message: 'Error searching artists' });
  }
};

// Search albums
exports.searchAlbums = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const albums = await Album.findAndCountAll({
      where: {
        title: { [Op.iLike]: `%${query}%` }
      },
      include: [
        { model: Artist, as: 'artist', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [['title', 'ASC']]
    });

    res.json({
      items: albums.rows,
      total: albums.count,
      page: parseInt(page),
      totalPages: Math.ceil(albums.count / limit)
    });
  } catch (error) {
    console.error('Error searching albums:', error);
    res.status(500).json({ message: 'Error searching albums' });
  }
};

// Search genres
exports.searchGenres = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const genres = await Genre.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      },
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    res.json({
      items: genres.rows,
      total: genres.count,
      page: parseInt(page),
      totalPages: Math.ceil(genres.count / limit)
    });
  } catch (error) {
    console.error('Error searching genres:', error);
    res.status(500).json({ message: 'Error searching genres' });
  }
}; 