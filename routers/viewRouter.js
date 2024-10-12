/* eslint-disable */
const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController')
const viewController = require('./../Controller/viewController')

router.post('/login', authController.loginSuccessfully);
router.post('/checkUserEmail', authController.findUserByEmail);
router.post('/signup', authController.signUpSuccessfully);
router.post('/logout', authController.logout);
router.post('/verify', authController.verifyUser);

router.get('/home', viewController.getOverView);
router.get('/hotel/:id', viewController.getHotel);
router.get('/hotel/:id/room/:roomId', viewController.getRoomFromHotel);
router.get('/search', viewController.search);

router.post('/hotel/:hotelId/room/:roomId/booking', authController.verifyUser, viewController.bookingHotel);

router.get('/me', authController.verifyUser, viewController.getMe);

module.exports = router;