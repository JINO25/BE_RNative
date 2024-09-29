/* eslint-disable */
const express = require('express');
const router = express.Router();
const reviewController = require('../Controller/reviewController');

router.route('/')
    .get(reviewController.getAllReview)
    .post(reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .put(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;