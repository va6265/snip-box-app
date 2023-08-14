const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const jwtUtils = require("../utils/jwtUtils");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const { promisify } = require("util");
const { send } = require("process");

const createSendToken = (user, statusCode, res) => {
  const token = jwtUtils.generateToken({ id: user._id });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // httpOnly: true,
    sameSite: "None",
    secure: true,
  };

  res.cookie("jwt", token, cookieOptions);

  //Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide with an email and address", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  createSendToken(user, 200, res);
});

exports.logout =(req, res, next) => {
  // Assuming you have stored the JWT in a cookie named 'token'
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success'
  })
};

exports.protect = catchAsync(async (req, res, next) => {
  //1) GET TOKEN
  console.log('protect 0');
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (token === "null")
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );

  //2) VERIFICATION TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) CHECK IF USER STILL EXISTS
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError("Invalid token! Please login again", 401));

  // 4) Check if user has changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password!. Please login again", 401)
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//   exports.isLoggedIn = (req, res, next) => {
//     if (req.user) { // Assuming you set `req.user` after successful authentication
//       next(); // User is logged in, proceed
//     } else {
//       res.status(401).json({ message: 'Unauthorized' });
//     }
//   }

exports.restrictTo = (...roles) => {
  //roles is an array of inputs
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have the permission to perform this action",
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new AppError("There is no user with this email address..", 404)
    );

  // 2)Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot password? Submit a new Patch request with new password and passwordConfirm to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 mins)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token is not expired, and there is a user, set new password
  if (!user) return next(new AppError("Token is invalid or expired", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 4)Log user in
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1)Get user from collection
  const user = await User.findById(req.user._id).select("+password");

  // 2) Check if POSTed passsword is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  )
    return next(new AppError("Wrong password", 401));

  //3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save(user);

  //4) Log user in, send JWT
  createSendToken(user, 200, res);
});
