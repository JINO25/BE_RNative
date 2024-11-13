/* eslint-disable */
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    voucher: [{
        id: String,
        discount: String
    }]
});

// const Booking = mongoose.model('Booking', bookingSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = Booking;
