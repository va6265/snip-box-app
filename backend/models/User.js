const mongoose = require('mongoose');
const crypto = require('crypto');
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
  role:{
    type: String,
    enum: ['user','admin'],
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
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

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp  = parseInt(
      this.passwordChangedAt.getTime()/1000,
      10
    )
    return JWTTimestamp<changedTimestamp;
  }

  // FALSE = UNCHANGED
  return false; 
}

userSchema.methods.createPasswordResetToken = function(){
  //sent via email
  const resetToken = crypto.randomBytes(32).toString('hex');

  //reset token encrypted to be stored in db
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
