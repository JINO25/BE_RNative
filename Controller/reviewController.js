/* eslint-disable */
const Review = require('../Model/reviewModel');
const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError')

exports.getAllReview = catchAsync(async (req, res, next) => {
    const doc = await Review.find();

    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            reviews: doc
        }
    })
});

exports.getReview = catchAsync(async (req, res, next) => {
    const doc = await Review.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            review: doc
        }
    })

});


exports.createReview = catchAsync(async (req, res, next) => {
    const doc = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: doc
    })

});

exports.updateReview = catchAsync(async (req, res, next) => {
    const doc = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc)
        return next(new CreateError('No review with ID', 404));

    res.status(200).json({
        status: 'success',
        data: {
            reviews: doc
        }
    })

});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const doc = await Review.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new CreateError(`No review with ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});