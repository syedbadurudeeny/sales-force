const { customerDeals, customerDealStateUpdate, getDealDetail, customerDealStateDelete } = require("../Controllers/dealsController");

const router = require("express").Router();


router.route('/deals').post(customerDeals);
router.route('/deals/:id').put(customerDealStateUpdate);
router.route('/deals/:id').delete(customerDealStateDelete);
router.route('/deals/:cname').get(getDealDetail);


module.exports = router;