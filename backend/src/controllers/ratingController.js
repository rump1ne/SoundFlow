const { Rating, User, Track, Playlist } = require('../models');
const { createNotification } = require('./notificationController');

// Get all ratings for a specific item
exports.getRatings = async (req, res) => {
  try {
    const { rateableType, rateableId } = req.params;
    const ratings = await Rating.findAll({
      where: { rateableType, rateableId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};

// Get a user's rating for a specific item
exports.getUserRating = async (req, res) => {
  try {
    const { rateableType, rateableId } = req.params;
    const rating = await Rating.findOne({
      where: {
        userId: req.user.id,
        rateableType,
        rateableId
      }
    });

    res.json(rating);
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ message: 'Error fetching user rating' });
  }
};

// Create or update a rating
exports.rateItem = async (req, res) => {
  try {
    const { rateableType, rateableId, value, comment } = req.body;

    // Validate rateable item exists
    let item;
    if (rateableType === 'track') {
      item = await Track.findByPk(rateableId);
    } else if (rateableType === 'playlist') {
      item = await Playlist.findByPk(rateableId);
    }

    if (!item) {
      return res.status(404).json({ message: `${rateableType} not found` });
    }

    // Create or update rating
    const [rating, created] = await Rating.findOrCreate({
      where: {
        userId: req.user.id,
        rateableType,
        rateableId
      },
      defaults: {
        value,
        comment
      }
    });

    if (!created) {
      await rating.update({ value, comment });
    }

    // Create notification for the owner of the track/playlist
    if (item.userId !== req.user.id) {
      await createNotification(
        item.userId,
        'rating',
        'New Rating',
        `${req.user.username} rated your ${rateableType} ${value} stars`,
        rating.id,
        'rating'
      );
    }

    res.json(rating);
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    res.status(500).json({ message: 'Error creating/updating rating' });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { rateableType, rateableId } = req.params;
    const rating = await Rating.findOne({
      where: {
        userId: req.user.id,
        rateableType,
        rateableId
      }
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    await rating.destroy();
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Error deleting rating' });
  }
}; 