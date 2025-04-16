const asyncHandler = require("express-async-handler");
const Deal = require('../Models/dealsModel')
const mongoose = require("mongoose");

//post
const customerDeals = asyncHandler( async(req,res)=>{
    const {userDeal} = req.body;

    try {
        if(!userDeal){
            return res.status(400).json({message: "Deal not found"})
        }
    
        const storeDeal = await Deal.create({
            dealName : userDeal.dealName,
            companyName : userDeal.companyName,
            dealState : userDeal.dealState
        })
    
        storeDeal.save();

        return res.status(200).json({message:"Deal added"})
    
    } catch (error) {
        console.log("Deal :", error)
        return res.status(400).json({message: "Deal not added - something went wrong"})
    }

})

//update
const customerDealStateUpdate = asyncHandler( async(req,res)=>{
    const dealId = req.params.id
    const {state_of_deal} = req.body;

    try {
        if(!dealId || !state_of_deal){
            return res.status(400).json({message : "Deal id not found"});
        }

        const updateDealState = await Deal.findByIdAndUpdate({_id:dealId},{
            dealState : state_of_deal
        },{new:true});

        updateDealState.save();

        return res.status(200).json({message:"Deal state updated ", updateDealState})

    } catch (error) {
        console.log('Deal state :', error);
        return res.status(400).json({message:"Deal state not updated - somethng went wrong "})
    }
})

//delete

const customerDealStateDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        // Validate the ID format
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Deal ID" });
        }

        const deleteDeal = await Deal.findByIdAndDelete(id);

        if (!deleteDeal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        return res.status(200).json({ message: "Deal successfully deleted", deleteDeal });
    } catch (error) {
        console.log("deal delete error: ", error);
        return res.status(500).json({ message: "Server error" });
    }
});


//get
const getDealDetail = asyncHandler( async(req,res)=>{
    const companyName = req.params.cname;

    try {
        if(!companyName){
            return res.status(400).json({message:"Company name not found"});
        }

        const getDealsCompany = await Deal.find({companyName:companyName});

        if(!getDealsCompany){
            return res.status(400).json({message:"Deals not found"});
        }

        return res.status(200).json({message:getDealsCompany})

    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"Deal detail not found"})
    }
})


module.exports = {customerDeals,customerDealStateUpdate,getDealDetail,customerDealStateDelete};