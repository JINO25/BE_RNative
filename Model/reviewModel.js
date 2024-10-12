/* eslint-disable */

const mongoose = require('mongoose');
const Hotel = require('./hotelModel');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Review must have title!']
    },
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 1,
        max: 5
    },
    createAt: {
        type: Date,
        default: Date.now()
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        // require: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     })
//     next();
// })

reviewSchema.statics.calAvgRating = async function (hotelId) {
    const stats = await this.aggregate([
        {
            $match: {
                hotel: hotelId
            }
        },
        {
            $group: {
                _id: '$hotel',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Hotel.findByIdAndUpdate(hotelId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Hotel.findByIdAndUpdate(hotelId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

reviewSchema.post('save', function () {
    // constructor here is the model who created that document
    this.constructor.calAvgRating(this.hotel);
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;