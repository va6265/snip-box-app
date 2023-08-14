const Paste = require("../models/Paste");
const User = require("../models/User");
const {Like, Dislike} = require('../models/LikeDislike')
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const mongoose = require("mongoose");

exports.createPaste = catchAsync(async (req, res, next) => {
  // Save the new paste to the database
  const savedPaste = await Paste.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      paste: savedPaste,
    },
  });
});


exports.updatePaste = catchAsync(async (req, res, next) => {
  const paste = await Paste.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!paste) {
    return next(new AppError("Paste not found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      paste,
    },
  });
});

exports.replacePaste = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, expirationDate } = req.body;

  // Find the paste by its id in the database using the Paste model
  let paste = await Paste.findById(id);

  if (!paste) {
    return next(new AppError("Paste not found with this ID", 404));
  }

  // Update the paste with new data
  paste.title = title;
  paste.content = content;
  paste.expirationDate = expirationDate;

  // Save the updated paste to the database
  const updatedPaste = await paste.save();

  res.status(200).json(updatedPaste);
});

exports.deletePaste = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find and remove the paste from the database using the Paste model
  const deletedPaste = await Paste.findByIdAndRemove(id);

  if (!deletedPaste) {
    return next(new AppError("Paste not found with this ID", 404));
  }

  res.status(200).json(deletedPaste);
});

//Get all pastes
exports.getAllPastes = catchAsync(async (req, res, next) => {
  // Retrieve all pastes from the database using the Paste model
  // EXECUTE QUERY
  // const features = new APIFeatures(
  //   Paste.find({ userId: req.user._id }),
  //   req.query
  // )
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  // const pastes = await features.query;

  const pastes = await Paste.find({userId : req.user._id});
  res.status(200).json(pastes);
});


exports.getSinglePaste = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {password} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new AppError("Invalid paste ID", 404));

  // Find a single paste from the database using the Paste model and the provided id
  const paste = await Paste.findById(id).select("+password");

  if (!paste) 
    return next(new AppError("Paste not found with this ID", 404));

  if(paste.password && !(await paste.correctPassword(password,paste.password)))
    return next(new AppError("Incorrect paste password", 401));

  let isEditable = false;
  if(req.user?._id.equals(paste.userId))
      isEditable = true;
  else if(paste.scope === 'private')
    return next(new AppError("Invalid access: Snip is private", 401))

  // Check if the paste is liked/disliked by the user if user exists
  let isLikeable = false, likedByUser = false, dislikedByUser = false;
  if(req.user){
    isLikeable = true;
    likedByUser = await Like.exists({ userId: req.user._id, pasteId: id });
    dislikedByUser = await Dislike.exists({ userId: req.user._id, pasteId: id });
}


  res.status(200).json({
    status: 'success',
    data: {...paste._doc, isEditable , isLikeable, likedByUser, dislikedByUser}
  });
});


exports.publicPastes = catchAsync(async(req,res,next)=>{
  const publicPastes = await Paste.find({ scope: 'public' });
  res.status(200).json({
    status: 'success',
    data: {
      publicPastes
    }
  })
});

// ACCESS CONTROL

exports.accessControl = catchAsync(async(req,res,next) => {
  let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];

    if (token === "null") return next();

    //2) VERIFICATION TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) CHECK IF USER STILL EXISTS
    const currentUser = await User.findById(decoded.id);

    if(currentUser && !currentUser.changedPasswordAfter(decoded.iat))
      req.user =  currentUser;

    next();
})



//LIKES DISLIKES
exports.likePaste = catchAsync (async (req,res,next)=> {
  const pasteId = req.params.id;
  const userId = req.user._id;
  const paste = await Paste.findById(pasteId);

  if (!paste) 
    return next(new AppError('Paste not found with this ID', 404));

  const userLiked = await Like.findOne({userId, pasteId });
  const userDisliked = await Dislike.findOne({userId, pasteId });

  console.log ('hi');
  if (userLiked) {
    // User already liked, remove like
    await Like.findByIdAndDelete(userLiked._id);
  } else if (!userDisliked) {
    // User didn't dislike, add like
    await new Like({ userId, pasteId }).save();
  } else {
    // User disliked, remove dislike and add like
    await Dislike.findByIdAndDelete(userDisliked._id);
    await new Like({userId, pasteId }).save();
  }
  res.status(200).json({
    status: 'success'
  })
})

exports.dislikePaste = catchAsync (async (req,res,next)=> {
  const pasteId = req.params.id;
  const userId = req.user._id;
  
  console.log('inside like')
  const paste = await Paste.findById(pasteId);

  if (!paste) 
    return next(new AppError('Paste not found with this ID', 404));

  const userLiked = await Like.findOne({userId, pasteId });
  const userDisliked = await Dislike.findOne({userId, pasteId });

  if (userDisliked) {
    // User already disliked, remove dislike
    await Dislike.findByIdAndDelete(userDisliked._id);
  } else if (!userLiked) {
    // User didn't like, add dislike
    await new Dislike({userId, pasteId }).save();
  } else {
    // User liked, remove like and add dislike
    await Like.findByIdAndDelete(userLiked._id);
    await new Dislike({userId, pasteId }).save();
  }
  res.status(200).json({
    status: 'success'
  })
})

// exports.getPastesStats = catchAsync(async (req, res, next) => {
//   const stats = await Paste.aggregate([
//     {
//       $match: { privacy: false },
//     },
//     {
//       $unwind: "$tags",
//     },
//     {
//       $group: {
//         _id: { $toUpper: "$tags" },
//         num: { $sum: 1 },
//         avgLikesCount: { $avg: "$likesCount" },
//         avgDislikesCount: { $avg: "$dislikesCount" },
//         maxLikesCount: { $max: "$likesCount" },
//         minLikesCount: { $min: "$likesCount" },
//       },
//     },
//     {
//       $sort: { avgLikesCount: 1 },
//       // $match: {_id : {$ne: 'NSFW'}}
//     },
//   ]);
//   res.status(200).json({
//     status: "success",
//     data: {
//       stats,
//     },
//   });
// });

exports.getLikeDislikeCount = catchAsync( async (req,res,next)=>{
  const pasteId = req.params.id;

  //mongoose count aggregation
  const likesCount = await Like.countDocuments({ pasteId });
  const dislikesCount = await Dislike.countDocuments({ pasteId });

  data =  { likesCount, dislikesCount };

  res.status(200).json({
    status: 'success',
    data
  })
})