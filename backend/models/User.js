const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'User must have a name']
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: [true, 'User email must be unique'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength:8,
    select: false
  },
  confirmPassword:{
    type: String,
    required: [true, 'User must enter a confirm password'],
    validate: {
      //THIS W0RKS ONLY ON SAVE(), CREATE() AND NOT ON UPDATE()
      validator: function(el){
        return el === this.password;
      },
      message: 'Passwords are not the same!!'
    }
  },
  pastes: {
    type: [{
      _id: false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paste',
        required: true
      },
      title : {
        type: String,
        required: true
      }
    }]
  }
});

//HOOKS
userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password,12);
  this.confirmPassword = undefined;

  next();
})

//INSTANCE METHODS
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
