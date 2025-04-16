const Email = require('../Controllers/emailController');
const EmailModel = require('../Models/emailModel');

const router = require('express').Router();

router.route('/send-email').post(Email);
router.route('/send-email/').get(async (req,res)=>{
    try {

        const getAllEmail = await EmailModel.find({});

        if(!getAllEmail){
            return res.status(400).json({message:"Emails not found"});
        }

        return res.status(200).json({message:getAllEmail})

    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"Email detail not found"})
    }
});


module.exports = router;