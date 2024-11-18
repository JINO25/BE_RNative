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
router.put('/hotel/:id', viewController.updateHotel);
router.put('/hotel/addUtility/:id', viewController.addUtility);

router.get('/hotel/:id/room/:roomId', viewController.getRoomFromHotel);
router.post('/hotel/:id', viewController.addRoom);

router.get('/search', viewController.search);
router.get('/getBooking/:id', viewController.getBookingForHotelier)


router.post('/hotel/:hotelId/room/:roomId/booking', authController.verifyUser, viewController.bookingHotel);
router.get('/me', authController.verifyUser, viewController.getMe);
router.get('/myBooking', authController.verifyUser, viewController.getMyBookingHotel);

module.exports = router;