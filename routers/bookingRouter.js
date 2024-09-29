/* eslint-disable */
const express = require('express');
const router = express.Router({ mergeParams: true });
const bookingController = require('../Controller/bookingController');

router.post('/booking', bookingController.createBooking);

module.exports = router;