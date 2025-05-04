const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticateMentor } = require('../../../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateMentor);

// Resource CRUD routes
router.post('/', resourceController.createResource);
router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResource);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

// Resource sharing routes
router.post('/:id/share', resourceController.shareResource);
router.get('/shared', resourceController.getSharedResources);
router.put('/share/:shareId', resourceController.updateShareStatus);

// Resource versioning routes
router.get('/:id/versions', resourceController.getResourceVersions);
router.post('/:id/versions/:versionId/restore', resourceController.restoreVersion);

module.exports = router; 