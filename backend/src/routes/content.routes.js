const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/generate', contentController.generateContent);
router.get('/history', contentController.getHistory);
router.patch('/:id/favorite', contentController.toggleFavorite);
router.post('/:id/rate', contentController.rateContent);
router.delete('/:id', contentController.deleteContent);

module.exports = router;
