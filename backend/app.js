const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const pasteRoutes = require('./routes/pasteRoutes');
const userRoutes = require('./routes/userRoutes');

// MIDDLEWARES
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    app.use((req,res,next)=> {
      req.requestedAt= new Date();
      next();
    })
}
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(cors());


// Mount the Paste routes
app.use('/api/pastes', pasteRoutes);

// Mount the User routes
app.use('/api/users', userRoutes);

// Define a default route to handle unknown endpoints
app.all('*',(req,res,next)=>{
  return next(new AppError(`Can't find ${req.originalUrl} route`,404));
})

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;