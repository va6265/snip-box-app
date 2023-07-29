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
    //GET TOKEN
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    
    if(!token)
        return next(new AppError('You are not logged in! Please log in to get access',401));

    // VERIFICATION TOKEN
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    console.log(decoded);

    next();
  })