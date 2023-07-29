// models/Paste.js
const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A paste must have a title'],
  },
  content: {
    type: String,
    trim: true,
    required: [true, ' A paste must have a content'],
  },
  expirationDate: {
    type: Date,
    default: null,
  },
  privacy: {
    type: Boolean,
    default: true, //default public
  },
  tags: {
    type: [String], // Array of strings
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt:{
    type : Date,
    default: Date.now()
  },
  category:{
    type: String,
    required: [true, 'A paste must have a category'],
    default: "None"
  },
  likesCount:{
    type: Number,
    default:0
  },
  dislikesCount:{
    type: Number,
    default:0
  },
  password: String 
});

const Paste = mongoose.model('Paste', pasteSchema);

module.exports = Paste;
