/* eslint-disable */
const User = require('../Model/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../middlewares/catchAsync');
const CreateError = require('./../utils/CreateError')

const generateAccessToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRIES
    });
}

const sendToken = async (user, statusCode, res) => {
    const token = generateAccessToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                photo: user.photo,
                name: user.name
            }
        }
    });
}

exports.findUserByEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
        return next(new CreateError('User not found!', 404));
    }
    return res.status(200).json({
        status: 'success'
    })
})

exports.loginSuccessfully = catchAsync(async (req, res, next) => {
    const email = req.body;
    const user = await User.findOne(email);

    if (!user) {
        return next(new CreateError('User not found!', 404));
    }

    sendToken(user, 201, res);
});

// exports.signUpSuccessfully = catchAsync(async (req, res) => {
//     const { name, email, photo, yearOfBirth } = req.body;
//     const user = await User.findOne(email);
//     if (user) {
//         return next(new CreateError('User has existed!', 400))
//     }
//     const account = await User.create({ name, email, photo, yearOfBirth });
//     sendToken(account._id, 201, res);
// })

exports.signUpSuccessfully = catchAsync(async (req, res, next) => {
    const { name, email, phone } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
        return next(new CreateError('User has existed!', 400))
    }
    const account = await User.create({ name: name, email: email, phone: phone });
    sendToken(account._id, 201, res);
})


exports.verifyUser = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        console.log("token: " + token);
    } else {
        return next(new CreateError('No token provided', 401));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode.id);

    if (!user) {
        return next(new CreateError('Not have user with id', 404));
    }

    req.user = user;

    // res.status(200).json({
    //     status: 'success',
    //     data: user
    // })

    next();

}

exports.logout = (req, res) => {
    res.cookie('jwtCookie', 'out', {
        expire: new Date(Date.now + 10 * 1000), //10 is 10 seconds
        httpOnly: true
    });
    res.status(200).json({
        status: 'success'
    });
}
