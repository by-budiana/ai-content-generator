const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public or Protected? Usually templates are public but can be protected.
router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplateById);

module.exports = router;
