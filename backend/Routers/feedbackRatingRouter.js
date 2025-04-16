const { createRating, getCompanyRating } = require('../Controllers/feedbackRatingController');

const router = require('express').Router();

router.route('/oppertunity').post(createRating);
router.route('/:name').get(getCompanyRating);


module.exports = router;