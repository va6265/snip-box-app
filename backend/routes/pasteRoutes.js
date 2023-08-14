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
  .post(pasteController.accessControl, pasteController.getSinglePaste)
  .patch(authController.protect, pasteController.updatePaste)
  .put(pasteController.replacePaste)
  .delete(authController.protect, authController.restrictTo('user'), pasteController.deletePaste);


router.get('/public',pasteController.publicPastes);
  
router.patch('/:id/like', authController.protect, pasteController.likePaste);
router.patch('/:id/dislike', authController.protect, pasteController.dislikePaste);
router.get('/:id/likeDislikeCount', pasteController.getLikeDislikeCount)


//   // Get pastes by tag
// router.get('/tags/:tag', async (req, res) => {
//     try {
//       const tag = '#' + req.params.tag; // Tag should start with #
//       const pastesWithTag = await Paste.find({ tags: tag });
//       res.json(pastesWithTag);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch pastes by tag' });
//     }
//   });

module.exports = router;