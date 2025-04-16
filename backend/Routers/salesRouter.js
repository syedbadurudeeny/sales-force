const { customerSales, customerSaleStateUpdate, customerSaleStateDelete, getSaleDetail, sendRepDisussEmail } = require("../Controllers/salesController");

const router = require("express").Router();


router.route('/sales').post(customerSales);
router.route('/sales/:id').put(customerSaleStateUpdate);
router.route('/sales/:id').delete(customerSaleStateDelete);
router.route('/sales/:cname').get(getSaleDetail);

//discuss email
router.route('/notify/email').post(sendRepDisussEmail);


module.exports = router;