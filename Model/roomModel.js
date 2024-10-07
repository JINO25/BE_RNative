/* eslint-disable */
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        require: true
    },
    name: {
        type: String,
        required: [true, 'Vui lòng cung cấp tên loại phòng']
    },
    bedQuantity: {
        type: Number,
        required: [true, 'Phòng phải có bao nhiêu giường']
    },
    area: {
        type: Number,
        required: [true, 'Diện tích căn phòng']
    },
    price: {
        type: Number,
        required: [true, 'Phải có giá phòng']
    },
    images: [String],
    description: {
        type: String
    },
    utilities: [{
        type: String
    }]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });



const Room = mongoose.model('Room', roomSchema);
module.exports = Room;