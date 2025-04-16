const { createCases, getAllCases, caseStatusUpdate, getAllCustCases, deleteCases, sendCustSupportDisussEmail } = require('../Controllers/casesController');

const router = require('express').Router();

router.route('/requests').post(createCases);
router.route('/cases/info/:company').get(getAllCases);
router.route('/cases/cust/info/:name').get(getAllCustCases);

//update
router.route('/status/update/:id').put(caseStatusUpdate);

//delete
router.route('/cases/info/:id').delete(deleteCases);

// discuss email
router.route('/notify/email').post(sendCustSupportDisussEmail);



module.exports = router;