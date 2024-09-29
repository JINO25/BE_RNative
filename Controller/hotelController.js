/* eslint-disable */
const Hotel = require('../Model/hotelModel');
const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError')

exports.getAllHotel = catchAsync(async (req, res, next) => {
    const doc = await Hotel.find();

    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            hotel: doc
        }
    })
});

exports.getHotel = catchAsync(async (req, res, next) => {
    const doc = await Hotel.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            hotel: doc
        }
    })

});


exports.createHotel = catchAsync(async (req, res, next) => {
    const doc = await Hotel.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            hotel: doc
        }
    })

});

exports.updateHotel = catchAsync(async (req, res, next) => {
    const doc = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc)
        return next(new CreateError('No hotel with ID', 404));

    res.status(200).json({
        status: 'success',
        data: {
            hotel: doc
        }
    })

});

exports.deleteHotel = catchAsync(async (req, res, next) => {
    const doc = await Hotel.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new CreateError(`No hotel with ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});