const asyncHandler = require('express-async-handler');
const CaseFeedback = require('../Models/feedbackCaseModel');


const caseReportFeedback = asyncHandler( async(req,res)=>{
    try {

        const {companyName,date,description,priority,status,support} = req.body;

        if(!companyName || !date || !description || !priority || !status || !support){
            return res.status(400).json({message : "All fields are not empty"})
        }

        const createCaseFeedback = await CaseFeedback.create({
            companyName,
            date,
            description,
            priority,
            status,
            support
        })

        createCaseFeedback.save();

        return res.status(201).json({message: "Report case feedback added!"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
});


const getCaseReportFeedback = asyncHandler( async(req,res)=>{
    const companyName = req.params.name;

    try {
        if(!companyName){
            return res.status(400).json({message:"Company name not found"});
        }

        const getReportCaseFeedback = await CaseFeedback.find({companyName:companyName});

        if(!getReportCaseFeedback){
            return res.status(400).json({message:"Case feedback not found"});
        }

        return res.status(200).json({message:getReportCaseFeedback})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"});
    }
});


module.exports = {caseReportFeedback,getCaseReportFeedback};