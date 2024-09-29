/* eslint-disable */
const express = require('express');
const router = express.Router();
const roomRouter = require('./roomRouter');
const bookingRouter = require('./bookingRouter');
const hotelController = require('../Controller/hotelController');

router.route('/')
    .get(hotelController.getAllHotel)
    .post(hotelController.createHotel);

router.route('/:id')
    .get(hotelController.getHotel)
    .put(hotelController.updateHotel)
    .delete(hotelController.deleteHotel);


router.use('/:hotelId/room', roomRouter)
router.use('/:hotelId/room/:roomId', bookingRouter);

module.exports = router;