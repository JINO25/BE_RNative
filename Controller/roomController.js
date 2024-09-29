/* eslint-disable */
const Room = require('../Model/roomModel');
const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError')

exports.getAllRoom = catchAsync(async (req, res, next) => {
    const hotelId = req.params.hotelId;
    const doc = await Room.find({ hotel: hotelId });

    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            Room: doc
        }
    })
});

exports.getRoom = catchAsync(async (req, res, next) => {
    // const hotelId = req.params.hotelId;
    const roomId = req.params.id
    const doc = await Room.findById(roomId);

    res.status(200).json({
        status: 'success',
        data: {
            Room: doc
        }
    })

});


exports.createRoom = catchAsync(async (req, res, next) => {
    const hotelId = req.params.hotelId;
    const { name, bedQuantity, area, price, utilities } = req.body
    const doc = await Room.create({
        hotel: hotelId, name, bedQuantity, area, price, utilities
    });

    res.status(201).json({
        status: 'success',
        data: {
            Room: doc
        }
    })

});

exports.updateRoom = catchAsync(async (req, res, next) => {
    const doc = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc)
        return next(new CreateError('No Room with ID', 404));

    res.status(200).json({
        status: 'success',
        data: {
            Room: doc
        }
    })

});

exports.deleteRoom = catchAsync(async (req, res, next) => {
    const doc = await Room.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new CreateError(`No Room with ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});