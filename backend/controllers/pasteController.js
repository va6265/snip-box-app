const Paste = require('../models/Paste');
const User = require('../models/User');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')

//Create a single paste and push new paste data(id,title) to the user document 

exports.createPaste = catchAsync(async (req, res, next) => {
    // Save the new paste to the database
    const savedPaste = await Paste.create(req.body);

    const { userId } = req.body; 

    if(userId) {

      const newPasteData = {id : savedPaste._id, title: savedPaste.title };

      User.updateOne(
        {_id : userId},
        {$push : {pastes : newPasteData}}
      )
      .then((success) => {
        console.log(success);
      })
      .catch((error) => { 
        console.log(error);
      })
    };

    res.status(201).json({
      status: 'success',
      data: {
        paste: savedPaste
      }});
})


exports.getSinglePaste = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find a single paste from the database using the Paste model and the provided id
    const paste = await Paste.findById(id);

    if (!paste) {
      return next(new AppError('Paste not found with this ID',404));
    }

    res.status(200).json(paste);
  })

exports.updatePaste = catchAsync(async (req,res, next) =>{
    const paste = await Paste.findByIdAndUpdate(req.params.id, req.body ,{
      new: true,
      runValidators: true
    })

    if (!paste) {
      return next(new AppError('Paste not found with this ID',404));
    }

    res.status(200).json({
      status: 'success',
      data:{
        paste
      }
    })
  })

exports.replacePaste = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, content, expirationDate } = req.body;

    // Find the paste by its id in the database using the Paste model
    let paste = await Paste.findById(id);

    if (!paste) {
      return next(new AppError('Paste not found with this ID',404));
    }

    // Update the paste with new data
    paste.title = title;
    paste.content = content;
    paste.expirationDate = expirationDate;

    // Save the updated paste to the database
    const updatedPaste = await paste.save();

    res.status(200).json(updatedPaste);
  })

exports.deletePaste = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find and remove the paste from the database using the Paste model
    const deletedPaste = await Paste.findByIdAndRemove(id);

    if (!deletedPaste) {
      return next(new AppError('Paste not found with this ID',404));
    }

    res.status(200).json(deletedPaste);
  })



//Get all pastes
exports.getAllPastes = catchAsync(async (req, res, next) => {
    // Retrieve all pastes from the database using the Paste model

    // EXECUTE QUERY
    const features = new APIFeatures(Paste.find(),req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const pastes = await features.query;

    res.status(200).json(pastes);
  })

exports.getPastesStats = catchAsync(async(req,res, next) => {
    const stats =await Paste.aggregate([
    {
      $match: { privacy: false}
     },
      {
        $unwind:'$tags'
      },
      {
        $group: {
        _id: {$toUpper: '$tags'},
        num: {$sum: 1},
        avgLikesCount : {$avg: '$likesCount'},
        avgDislikesCount : {$avg: '$dislikesCount'},
        maxLikesCount: {$max: '$likesCount'},
        minLikesCount: {$min: '$likesCount'}
      }
    },
      {
        $sort: { avgLikesCount: 1},
      // $match: {_id : {$ne: 'NSFW'}} 
    }])
    res.status(200).json({
      status:'success',
      data:{
        stats
      }
    })
  })
