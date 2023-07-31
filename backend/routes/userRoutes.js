const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login',authController.login);

router.post('/forgotPassword',authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router
    .route('/')
    .get(userController.getPastes);

module.exports = router;