/* eslint-disable */
const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

router.route('/')
    .get(userController.getAllUser)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;