const { newAccount } = require('../Controllers/accountController');

const router = require('express').Router();

router.route('/account').post(newAccount);


module.exports = router;