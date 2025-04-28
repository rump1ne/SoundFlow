const { User, Favorite, History } = require('../models');

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ username, email, bio });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get user favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: ['track', 'playlist']
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};

// Add favorite
exports.addFavorite = async (req, res) => {
  try {
    const { favoriteType, favoriteId } = req.body;
    const favorite = await Favorite.create({
      userId: req.user.id,
      favoriteType,
      favoriteId
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite', error: error.message });
  }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { favoriteType, favoriteId } = req.params;
    const favorite = await Favorite.findOne({
      where: {
        userId: req.user.id,
        favoriteType,
        favoriteId
      }
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await favorite.destroy();
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite', error: error.message });
  }
};

// Get user history
exports.getHistory = async (req, res) => {
  try {
    const history = await History.findAll({
      where: { userId: req.user.id },
      include: ['track'],
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

// Clear user history
exports.clearHistory = async (req, res) => {
  try {
    await History.destroy({
      where: { userId: req.user.id }
    });
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing history', error: error.message });
  }
}; 