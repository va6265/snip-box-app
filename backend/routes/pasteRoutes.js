const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteController');
const authController = require('../controllers/authController');

// Route for creating a new paste
router
  .route('/')
  .get(authController.protect, pasteController.getAllPastes)
  .post(pasteController.createPaste);

// Route for fetching a single paste by ID
router
  .route('/:id')
  .get(pasteController.getSinglePaste)
  .patch(pasteController.updatePaste)
  .put(pasteController.replacePaste)
  .delete(authController.protect, authController.restrictTo('admin'), pasteController.deletePaste);

  // Get pastes by tag
router.get('/tags/:tag', async (req, res) => {
    try {
      const tag = '#' + req.params.tag; // Tag should start with #
      const pastesWithTag = await Paste.find({ tags: tag });
      res.json(pastesWithTag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pastes by tag' });
    }
  });


// Get all public pastes
router.get('/public', async (req, res) => {
  try {
    const publicPastes = await Paste.find({ privacy: true });
    res.json(publicPastes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public pastes' });
  }
});

// Get all private pastes for the authenticated user
router.get('/private', async (req, res) => {
  try {
    const privatePastes = await Paste.find({ privacy: false, user: req.user._id });
    res.json(privatePastes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch private pastes' });
  }
});

module.exports = router;