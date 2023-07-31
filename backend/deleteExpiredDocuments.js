const cron = require('node-cron');
const Paste = require('./models/Paste'); // Replace with the correct path to your model file

// Schedule the task to run every day at midnight (adjust as needed)
const autoDeleteTask = cron.schedule('*/30 * * * *', async () => {
  try {
    const now = new Date();
    // Find and delete all documents where the 'expireAt' field is less than or equal to the current time
    const {deletedCount} = await Paste.deleteMany({ expireAt: { $lte: now } });
    if(!deletedCount)
        console.log("Zero documents expired");
    else
        console.log('${deletedCount} expired documents deleted successfully.');
  } catch (error) {
    console.error('Error deleting expired documents:', error);
  }
});

module.exports = autoDeleteTask;