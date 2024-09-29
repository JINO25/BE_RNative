/* eslint-disable */
const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Vui long cung cấp đúng định dạng email'],
        required: [true, 'User must have email']
    },
    photo: String,
    role: {
        type: String,
        default: 'User'
    },
    yearOfBirth: {
        type: Number
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;