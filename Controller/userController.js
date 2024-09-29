/* eslint-disable */
const User = require('../Model/userModel');
const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError')

exports.getAllUser = catchAsync(async (req, res, next) => {
    const doc = await User.find();

    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            users: doc
        }
    })
});

exports.getUser = catchAsync(async (req, res, next) => {
    const doc = await User.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            user: doc
        }
    })

});


exports.createUser = catchAsync(async (req, res, next) => {
    const doc = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            users: doc
        }
    })

});

exports.updateUser = catchAsync(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc)
        return next(new CreateError('No user with ID', 404));

    res.status(200).json({
        status: 'success',
        data: {
            users: doc
        }
    })

});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const doc = await User.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new CreateError(`No tour with ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});