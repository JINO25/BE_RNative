/*eslint-disable*/
const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError');
const Hotel = require('./../Model/hotelModel');
const Room = require('./../Model/roomModel');
const Booking = require('./../Model/bookingModel');
const mongoose = require('mongoose');
const { checkout } = require('../routers/viewRouter');

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
    const { checkIn, CheckOutDate, quantity, total, methodPayment, voucher } = req.body;

    console.log("method: " + methodPayment);


    const checkHotel = await Hotel.findById({ _id: hotelId });

    const checkRoom = await Room.findById({ _id: roomId });
    if (!checkHotel && !checkRoom) {
        return next(new CreateError('No hotel or room from hotel!', 404));
    }

    if (voucher != null) {
        const rs = await Booking.create({
            user,
            hotel: hotelId,
            room: roomId,
            checkInDate: checkIn,
            checkOutDate: CheckOutDate,
            totalPrice: total,
            quantity,
            method: methodPayment,
            voucher
        });

        res.status(200).json({
            status: 'success',
            data: rs
        });

    } else {

        try {
            console.log(1);

            const rs = await Booking.create({
                user,
                hotel: hotelId,
                room: roomId,
                checkInDate: checkIn,
                checkOutDate: CheckOutDate,
                totalPrice: total,
                quantity,
                method: methodPayment
            });

            res.status(200).json({
                status: 'success',
                data: rs
            });
        } catch (error) {
            console.log(error);

        }
    }



});

exports.getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: req.user
    })
})

exports.getMyBookingHotel = catchAsync(async (req, res) => {
    const user = req.user;
    const hotel = await Booking.find({ user: user._id }).populate({
        path: 'hotel',
        select: 'name address imgCover'
    }).populate({
        path: 'room',
        select: 'name bedQuantity'
    })

    res.status(200).json({
        status: 'success',
        data: hotel
    });

});

exports.updateHotel = catchAsync(async (req, res) => {
    const { id } = req.params;

    console.log(id);

    // const { name, address, city, description } = req.body;

    const updates = {};
    const allowedFields = ['name', 'address', 'city', 'description'];

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'No valid fields provided for update.'
        });
    }

    console.log(updates);


    const hotel = await Hotel.findOneAndUpdate({
        _id: id
    },
        updates
        , {
            new: true
        });

    if (!hotel) {
        return res.status(404).json({
            status: 'fail',
            message: 'Hotel not found.'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            hotel
        }
    })
});

exports.addUtility = catchAsync(async (req, res) => {
    const { id } = req.params;

    const { utilities } = req.body;

    const update = await Hotel.findOneAndUpdate({
        _id: id
    }, {
        $push: { utilities }
    }, {
        new: true
    });

    res.status(200).json({
        status: 'success',
        update
    });

});

exports.addRoom = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, bedQuantity, area, price } = req.body;

    const images = [
        "room_1.1.jpg",
        "room_1.2.jpg"
    ];

    const utilities = [
        "có chỗ nấu nướng",
        "vòi sen, bồn tắm"
    ]
    const data = await Room.create({
        hotel: id, name, bedQuantity, area, price, images, utilities
    });

    res.status(200).json({
        status: 'success',
        data: {
            data
        }
    })

});

exports.updateRoom = catchAsync(async (req, res) => {
    const { id, roomId } = req.params;
    const { name, bedQuantity, area, price, quantity, img, utilities } = req.body;

    const data = await Room.create({
        hotel: id, name, bedQuantity, area, price, images: img, quantity, utilities
    });

    res.status(200).json({
        status: 'success',
        data: {
            data
        }
    })

});

exports.deleteRoom = catchAsync(async (req, res) => {
    const { id, roomId } = req.params;

    const doc = await Room.findOneAndDelete({
        _id: roomId,
        hotel: id
    });


    res.status(200).json({
        status: 'success',
        data: null
    })
})

exports.getBookingForHotelier = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Booking.find({ hotel: id }).populate({
        path: 'user',
        select: 'name email phone'
    }).populate({
        path: 'room',
        select: 'name'
    });

    if (!data) {
        res.status(404).json({
            status: 'fail',
            message: `No data with hotel id: ${id}`
        });
    }

    res.status(200).json({
        status: 'success',
        data
    });

})