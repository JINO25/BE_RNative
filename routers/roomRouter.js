/* eslint-disable */
const express = require('express');
const router = express.Router({ mergeParams: true });
const roomController = require('../Controller/roomController');
//api hotel/:idHotel/room
router.route('/')
    .get(roomController.getAllRoom)
    .post(roomController.createRoom);

router.route('/:id')
    .get(roomController.getRoom)
    .put(roomController.updateRoom)
    .delete(roomController.deleteRoom);

module.exports = router;