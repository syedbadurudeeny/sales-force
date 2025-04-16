const { userRegister, userLogin, getSalesRep, salesRepTasks, getSupportEng } = require('../Controllers/userController');

const router = require('express').Router();


router.route('/register').post(userRegister);
router.route('/login').post(userLogin);

// get sales rep
router.route('/salesrep/:name').get(getSalesRep);
router.route('/salesrep/tasks/:name').get(salesRepTasks);

// get support eng
router.route('/support-eng/:name').get(getSupportEng);


module.exports = router;