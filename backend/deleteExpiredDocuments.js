const cron = require('node-cron');
const Paste = require('./models/Paste');
const {Like, Dislike} = require('./models/LikeDislike')

// Schedule the task
const autoDeleteTask = cron.schedule('0 */10 * * * *', async () => {
  try {
    const now = new Date(Date.now());
    console.log('deleting...')


    const pastesToDelete = await Paste.find({ expiresAt: { $lt: now } });
    const pasteIdsToDelete = pastesToDelete.map(paste => paste._id);

     // Delete pastes
     const pasteResult = await Paste.deleteMany({ expiresAt: { $lt: now } });
     console.log(`${pasteResult.deletedCount} expired paste(s) deleted`);
     
     // Delete corresponding likes
     const likeResult = await Like.deleteMany({ pasteId: { $in: pasteIdsToDelete } });
     console.log(`${likeResult.deletedCount} expired like(s) deleted`);
     
     // Delete corresponding dislikes
     const dislikeResult = await Dislike.deleteMany({ pasteId: { $in: pasteIdsToDelete } });
     console.log(`${dislikeResult.deletedCount} expired dislike(s) deleted`);
        
  } catch (error) {
    console.error('Error deleting expired documents:', error);
  }
});

module.exports = autoDeleteTask;