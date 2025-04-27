const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const collaboratorController = require('../controllers/collaboratorController');

// Protected routes
router.get('/playlist/:playlistId', auth, collaboratorController.getCollaborators);
router.post('/playlist/:playlistId', auth, collaboratorController.addCollaborator);
router.delete('/playlist/:playlistId/collaborator/:collaboratorId', auth, collaboratorController.removeCollaborator);
router.put('/playlist/:playlistId/collaborator/:collaboratorId/role', auth, collaboratorController.updateCollaboratorRole);

module.exports = router; 