const { caseReportFeedback, getCaseReportFeedback } = require('../Controllers/feedbackCaseController');

const router = require('express').Router();


router.route('/case/duration').post(caseReportFeedback);
router.route('/:name').get(getCaseReportFeedback);


module.exports = router;