/*eslint-disable*/
const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError');
const Hotel = require('./../Model/hotelModel');
const Room = require('./../Model/roomModel');
const Booking = require('./../Model/bookingModel');
const mongoose = require('mongoose');

exports.getOverView = catchAsync(async (req, res, next) => {
    const doc = await Hotel.find();
    const docStandoutDestination = await Hotel.find({
        ratingsAverage: {
            $gte: 4.5
        }
    }, {
        city: 1,
        imgCover: 1
    });
    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            hotel: doc,
            standoutDestination: docStandoutDestination
        }
    })
});

exports.getHotel = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CreateError('Invalid hotel ID format', 400));
    }
    const hotel = await Hotel.findById(id).populate({
        path: 'reviews',
        select: 'user review rating createAt title',
        populate: {
            path: 'user',
            select: 'name photo'
        }
    }).populate({
        path: 'rooms',
        select: 'name bedQuantity area price images utilities quantity'

    });



    if (!hotel)
        return next(new CreateError('No hotel with id', 404));

    res.status(200).json({
        status: 'success',
        doc: hotel
    });

});

exports.getRoomFromHotel = catchAsync(async (req, res, next) => {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return next(new CreateError('Invalid room ID format', 400));
    }

    const roomFromHotel = await Room.findById(roomId);


    if (!roomFromHotel) {
        return next(new CreateError('No room found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        doc: roomFromHotel
    });
});

exports.search = catchAsync(async (req, res, next) => {
    const { key } = req.query;
    console.log(key);

    const queries = await Hotel.find({
        $or: [
            { name: { $regex: key, $options: 'i' } },
            { city: { $regex: key, $options: 'i' } }
        ]
    });

    if (queries.length == 0) {
        return res.status(404).json({
            message: `Hiện tại chúng tôi đang cập nhật dữ liệu về ${key}, mong quý khách thông cảm.`
        });
    }

    res.status(200).json({
        status: 'success',
        data: queries
    });

});

exports.bookingHotel = catchAsync(async (req, res, next) => {
    const user = req.user;

    const { hotelId, roomId } = req.params;

    const checkHotel = await Hotel.findById({ _id: hotelId });

    const checkRoom = await Room.findById({ _id: roomId });
    if (!checkHotel && !checkRoom) {
        return next(new CreateError('No hotel or room from hotel!', 404));
    }

    const rs = await Booking.create({ user, hotel: hotelId, room: roomId })

    res.status(200).json({
        status: 'success',
        data: rs
    });

});

exports.getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: req.user
    })
})