const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const jwtUtils = require('../utils/jwtUtils');
const AppError = require('../utils/appError');
const {promisify} = require('util');

exports.signup = catchAsync(async(req,res,next)=>{
    const {name, email, password, confirmPassword} = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword,
    });
    const token = jwtUtils.generateToken({id: newUser._id});
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password)
        return next(new AppError('Please provide with an email and address', 400));
    
    const user = await User.findOne({email}).select('+password');

    if(!user||!(await user.correctPassword(password,user.password)))
        return next(new AppError('Incorrect email or password',401));

    const token= jwtUtils.generateToken({id: user._id});
    
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async(req,res,next)=>{
    //1) GET TOKEN
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    
    if(!token)
        return next(new AppError('You are not logged in! Please log in to get access',401));

    //2) VERIFICATION TOKEN
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    //3) CHECK IF USER STILL EXISTS
    const currentUser = await User.findById(decoded.id);
    if(!currentUser)
        return next(new AppError('The user belonging to this token no longer exists!',401));

    // 4) Check if user has changed password after the toke was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password!. Please login again',401));
    }

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  })


  exports.restrictTo = (...roles)=>{
    //roles is an array of inputs
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new AppError('You do not have the permission to perform this action',403)
            )
        }
        next();
    }
  };

  exports.forgotPassword = catchAsync(async(req,res,next)=>{
    // 1) Get user based on POSTed email
    const user = await User.findOne({email: req.body.email});
    if(!user)
        return next(new AppError('There is no user with this email address..',404));

    // 2)Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // 3) Send it to user's email



  })

  exports.resetPassword =()=>{

  }
  