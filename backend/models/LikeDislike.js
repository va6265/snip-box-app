const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' ,
    required: [true, 'Like must belong to a user'],
  },
  pasteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Paste' ,
    required: [true, 'Like must belong to a snip'],
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const dislikeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' ,
    required: [true, 'Disike must belong to a user'],
  },
  pasteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Paste' ,
    required: [true, 'Like must belong to a snip'],
  },
  timestamp: {
    type: Date, 
    default: Date.now 
  },
});

exports.Like = mongoose.model('Like', likeSchema);
exports.Dislike = mongoose.model('Dislike', dislikeSchema);
