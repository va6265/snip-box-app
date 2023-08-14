const jwt = require('jsonwebtoken');

const catchAsync = require('./catchAsync');

const  secretKey  = process.env.JWT_SECRET;

// Function to generate a JWT
exports.generateToken = (payload) => {
  // Generate a JWT with the payload and secret key
  return jwt.sign(payload, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN 
  });
};

// Function to verify a JWT
exports.verifyToken = (token) => {
    // Verify the JWT using the secret key
    const decoded = jwt.verify(token, secretKey);
    return decoded;
}
