/* eslint-disable */
const Booking = require('../Model/bookingModel');
const User = require('../Model/userModel');
const Hotel = require('../Model/hotelModel');
const Room = require('../Model/roomModel');

const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError')

exports.createBooking = catchAsync(async (req, res, next) => {
    const { userId, checkInDate, checkOutDate, totalPrice } = req.body
    const { hotelId, roomId } = req.params;


    const user = await User.findById(userId);
    const hotel = await Hotel.findById(hotelId);
    const room = await Room.findById(roomId);

    if (!user || !hotel || !room) {
        return next(new CreateError('User, Hotel, or Room not found', 404));
    }


    const booking = await Booking.create({
        user: userId,
        hotel: hotelId,
        room: roomId,
        checkInDate,
        checkOutDate,
        totalPrice
    });

    res.status(201).json({
        status: 'success',
        data: {
            booking
        }
    });
});
