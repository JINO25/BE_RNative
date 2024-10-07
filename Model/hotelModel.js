/* eslint-disable */
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng cung cấp tên khách sạn']
    },
    street: {
        type: String
    },
    address: {
        type: String,
        required: [true, 'Vui lòng cung cấp địa chỉ']
    },
    city: {
        type: String,
        required: [true, 'Vui lòng cung cấp tỉnh thành']
    },
    price: {
        type: Number,
        required: [true, 'Vui lòng cung cấp giá']
    },
    ratingsQuantity: Number,
    ratingsAverage: Number,
    size: [{
        type: Number
    }],
    utilities: [{
        type: String
    }],
    images: [String],
    imgCover: {
        type: String
    },
    slug: String,
    hotelier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

hotelSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'hotel'
});

hotelSchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'hotel'
});

// hotelSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'rooms',
//         // select: 'name bedQuantity'
//     });
//     next();
// })

// hotelSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'reviews',
//         select: 'user review',
//         populate: {
//             path: 'user',
//             select: 'name'
//         }
//     });
//     next();
// });

hotelSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'hotelier',
        select: 'name email'
    });
    next();
});

hotelSchema.pre('save', function (next) {
    this.slug = this._id;
    next();
})

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;