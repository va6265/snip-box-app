const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const pasteRoutes = require('./routes/pasteRoutes');
const userRoutes = require('./routes/userRoutes');

//GLOBAL MIDDLEWARES

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// connect with frontend
const corsOptions = {
  origin: ['https://snip-box-app.vercel.app','http://127.0.0.1:3000'],
  credentials: true
}
app.use(cors(corsOptions));


app.disable('etag');

// Set security HTTP headers
app.use(helmet());

// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    app.use((req,res,next)=> {
      req.requestedAt= new Date();
      next();
    })
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

if(process.env.NODE_ENV === 'production')
  app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'title',
      'content',
      'expirationDate',
      'privacy',
      'createdAt',
      'category',
      'likesCount',
      'dislikesCount'
    ]
  })
);


 

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
