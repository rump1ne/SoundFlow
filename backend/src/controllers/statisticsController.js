const { Track, Playlist, User, History, Favorite, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');
const { createError } = require('../utils/errors');

// Get user statistics for the last 30 days
exports.getUserStatistics = async (req, res) => {
    try {
        const userId = req.user.id;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Get total listens in the last 30 days
        const totalListens = await History.count({
            where: {
                userId,
                createdAt: { [Op.gte]: thirtyDaysAgo }
            }
        });

        // Get unique tracks listened to
        const uniqueTracks = await History.count({
            where: {
                userId,
                createdAt: { [Op.gte]: thirtyDaysAgo }
            },
            distinct: true,
            col: 'trackId'
        });

        // Get genre distribution
        const genreDistribution = await History.findAll({
            attributes: [
                'Track.genre',
                [sequelize.fn('COUNT', sequelize.col('Track.id')), 'count']
            ],
            include: [{
                model: Track,
                attributes: ['genre']
            }],
            where: {
                userId,
                createdAt: { [Op.gte]: thirtyDaysAgo }
            },
            group: ['Track.genre']
        });

        // Get favorite tracks count
        const favoritesCount = await Favorite.count({
            where: { userId }
        });

        // Get playlist count
        const playlistCount = await Playlist.count({
            where: { userId }
        });

        // Get recent history (last 10 tracks)
        const recentHistory = await History.findAll({
            where: { userId },
            include: [{
                model: Track,
                attributes: ['id', 'title', 'artist', 'genre']
            }],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        res.json({
            totalListens,
            uniqueTracks,
            genreDistribution,
            favoritesCount,
            playlistCount,
            recentHistory
        });
    } catch (error) {
        console.error('Error getting user statistics:', error);
        res.status(500).json(createError('Failed to retrieve user statistics'));
    }
};

// Get playlist statistics
exports.getPlaylistStatistics = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const userId = req.user.id;

        // Check if playlist exists and user has access
        const playlist = await Playlist.findOne({
            where: {
                id: playlistId,
                [Op.or]: [
                    { userId },
                    { isPublic: true }
                ]
            }
        });

        if (!playlist) {
            return res.status(404).json(createError('Playlist not found or access denied'));
        }

        // Get total tracks and duration
        const playlistStats = await Playlist.findOne({
            where: { id: playlistId },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Tracks.id')), 'totalTracks'],
                [sequelize.fn('SUM', sequelize.col('Tracks.duration')), 'totalDuration']
            ],
            include: [{
                model: Track,
                attributes: []
            }]
        });

        // Get play counts for tracks in playlist
        const trackPlays = await History.findAll({
            attributes: [
                'trackId',
                [sequelize.fn('COUNT', sequelize.col('History.id')), 'plays']
            ],
            include: [{
                model: Track,
                required: true,
                include: [{
                    model: Playlist,
                    where: { id: playlistId }
                }]
            }],
            group: ['trackId']
        });

        // Get rating statistics
        const ratings = await Rating.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('value')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
            ],
            where: {
                rateableType: 'playlist',
                rateableId: playlistId
            }
        });

        res.json({
            ...playlistStats.get(),
            trackPlays,
            ratings: ratings[0]
        });
    } catch (error) {
        console.error('Error getting playlist statistics:', error);
        res.status(500).json(createError('Failed to retrieve playlist statistics'));
    }
};

// Get track statistics
exports.getTrackStatistics = async (req, res) => {
    try {
        const { trackId } = req.params;

        // Get play count
        const playCount = await History.count({
            where: { trackId }
        });

        // Get favorite count
        const favoriteCount = await Favorite.count({
            where: {
                trackId,
                type: 'track'
            }
        });

        // Get rating statistics
        const ratings = await Rating.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('value')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
                [sequelize.fn('COUNT', sequelize.fn('CASE WHEN value = 5 THEN 1 END')), 'fiveStars'],
                [sequelize.fn('COUNT', sequelize.fn('CASE WHEN value = 4 THEN 1 END')), 'fourStars'],
                [sequelize.fn('COUNT', sequelize.fn('CASE WHEN value = 3 THEN 1 END')), 'threeStars'],
                [sequelize.fn('COUNT', sequelize.fn('CASE WHEN value = 2 THEN 1 END')), 'twoStars'],
                [sequelize.fn('COUNT', sequelize.fn('CASE WHEN value = 1 THEN 1 END')), 'oneStar']
            ],
            where: {
                rateableType: 'track',
                rateableId: trackId
            }
        });

        res.json({
            playCount,
            favoriteCount,
            ratings: ratings[0]
        });
    } catch (error) {
        console.error('Error getting track statistics:', error);
        res.status(500).json(createError('Failed to retrieve track statistics'));
    }
};

// Get artist statistics
exports.getArtistStatistics = async (req, res) => {
    try {
        const { artistId } = req.params;

        // Get total tracks
        const totalTracks = await Track.count({
            where: { artistId }
        });

        // Get total plays across all tracks
        const totalPlays = await History.count({
            include: [{
                model: Track,
                where: { artistId },
                required: true
            }]
        });

        // Get genre distribution
        const genreDistribution = await Track.findAll({
            attributes: [
                'genre',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { artistId },
            group: ['genre']
        });

        // Get top tracks
        const topTracks = await Track.findAll({
            where: { artistId },
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Histories.id')), 'playCount']
                ]
            },
            include: [{
                model: History,
                attributes: []
            }],
            group: ['Track.id'],
            order: [[sequelize.fn('COUNT', sequelize.col('Histories.id')), 'DESC']],
            limit: 10
        });

        res.json({
            totalTracks,
            totalPlays,
            genreDistribution,
            topTracks
        });
    } catch (error) {
        console.error('Error getting artist statistics:', error);
        res.status(500).json(createError('Failed to retrieve artist statistics'));
    }
};

// Get platform statistics (admin only)
const getPlatformStatistics = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.count();
        const totalTracks = await Track.count();
        const totalPlaylists = await Playlist.count();
        const totalPlays = await History.count();

        // Get most played tracks
        const mostPlayedTracks = await History.findAll({
            attributes: [
                'trackId',
                [sequelize.fn('COUNT', sequelize.col('History.id')), 'plays']
            ],
            include: [{
                model: Track,
                attributes: ['title', 'artist']
            }],
            group: ['trackId'],
            order: [[sequelize.fn('COUNT', sequelize.col('History.id')), 'DESC']],
            limit: 10
        });

        // Get users with most playlists
        const mostCreatedPlaylists = await Playlist.findAll({
            attributes: [
                'userId',
                [sequelize.fn('COUNT', sequelize.col('Playlist.id')), 'playlistCount']
            ],
            include: [{
                model: User,
                attributes: ['username']
            }],
            group: ['userId'],
            order: [[sequelize.fn('COUNT', sequelize.col('Playlist.id')), 'DESC']],
            limit: 10
        });

        res.json({
            totalUsers,
            totalTracks,
            totalPlaylists,
            totalPlays,
            mostPlayedTracks,
            mostCreatedPlaylists
        });
    } catch (error) {
        console.error('Error getting platform statistics:', error);
        res.status(500).json(createError('Failed to retrieve platform statistics'));
    }
}; 