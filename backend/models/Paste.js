// models/Paste.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const pasteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A paste must have a title'],
    trim: true,
  },
  content: {
    type: String,
    trim: true,
    required: [true, ' A paste must have a content'],
  },
  expiresAt: {
    type: Date,
  },
  scope: {
    type: String,
    default: 'unlisted',
    enum: ['unlisted','private','public']
  },
  tags: {
    type: [String], // Array of strings
    default: [],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt:{
    type : Date,
    default: Date.now
  },
  category:{
    type: String,
    default: "None"
  },
  password: {
    type: String,
    minlength:5,
    select: false,
    default: null
  },
});

// pasteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });

//HOOKs
pasteSchema.pre('save',function(next){
  if(this.expiresAt) return next();
  this.expiresAt = new Date('2100');
  next();
})

pasteSchema.pre('save',async function(next){
  if(!this.password || !this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,12);
  next();
})

pasteSchema.pre(/^find/, function(next){
  //this points to the current query
  this.find({expiresAt: {$gt: new Date(Date.now())}});
  next();
})

//INSTANCE METHODS
pasteSchema.methods.correctPassword = async function(candidatePassword, pastePassword){
  return await bcrypt.compare(candidatePassword,pastePassword);
}

const Paste = mongoose.model('Paste', pasteSchema);

module.exports = Paste;