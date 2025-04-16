const asyncHandler = require('express-async-handler');
const Cases = require('../Models/casesModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('../Models/userModel');


const createCases = asyncHandler( async(req,res)=>{

    try {

        const {companyName,description,support,priority,date,status} = req.body;

        if(!companyName || !description || !support || !priority || !date || !status){
            return res.status(400).json({message : "All fields are not empty"});
        }

        const newCase = await Cases.create({
            companyName,
            description,
            support,
            priority,
            date,
            status
        });

        newCase.save();

        return res.status(200).json({message:"Case added"})

    } catch (error) {
        console.log("Case :", error)
        return res.status(400).json({message: "Case not added - something went wrong"})
    }

});


const getAllCases = asyncHandler( async(req,res)=>{
    try {
        
        const companyName = req.params.company;

        if(!companyName) return res.status(400).json({message:"Case not found"});

        const getCompanyCases = await Cases.find({companyName : companyName});

        if(getCompanyCases) return res.status(200).json({message:getCompanyCases});

        return res.status(400).json({message : "Something went wrong"})

    } catch (error) {
        console.log("get case :", error)
        return res.status(500).json({message: "Internal server error"})
    }
})


const getAllCustCases = asyncHandler( async(req,res)=>{
    try {
        
        const custName = req.params.name;

        if(!custName) return res.status(400).json({message:"Case not found"});

        const getcustCases = await Cases.find({support : custName});

        if(getcustCases) return res.status(200).json({message:getcustCases});

        return res.status(400).json({message : "Something went wrong"})

    } catch (error) {
        console.log("get case :", error)
        return res.status(500).json({message: "Internal server error"})
    }
})


const caseStatusUpdate = asyncHandler( async(req,res)=>{
    try {
        
        const id = req.params.id;

        const {status_of_case} = req.body;

        if(!id || !status_of_case) return res.status(400).json({message : "Id / status not found"});

        const statusUpdate = await Cases.findByIdAndUpdate({_id : id},{
            status : status_of_case
        },{new:true})

        if(!statusUpdate) return res.status(400).json({message:"Status not updated - something went wrong"})

        return res.status(201).json({message:"Status updated successfully"});

    } catch (error) {
        console.log("case status : ",error);
        return res.status(500).json({message:"Internal server error"});
    }
});


const deleteCases = asyncHandler( async(req,res)=>{
    try {
        
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Sale ID" });
        }

        const deleteCase = await Cases.findByIdAndDelete({_id:id});

        if (!deleteCase) {
            return res.status(404).json({ message: "Case not found" });
        }

        return res.status(200).json({message: "Case successfully deleted"});

    } catch (error) {
        console.log("delete : ", error);
        return res.status(500).json({message : "Internal server error"});
    }
})



const sendCustSupportDisussEmail = asyncHandler( async(req,res)=>{
    try {
        const { custname } = req.body;
        console.log("custname : ",custname)

            let sent_mail = ""
            const findCust = await User.findOne({username : custname});

            if(findCust){
                sent_mail = findCust.email
            }else{
                sent_mail = "greentreegtss@gmail.com"
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.from,
                    pass: process.env.pass
                }
            });
        
        
            const mailOptions = {
                from: process.env.from,
                to: sent_mail,
                subject: "Discussion",
                text: "About a case"
            };
        
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(201).json({message : "Email sent"})
                }
            });
    } catch (error) {
        console.log(error)
    }
})


module.exports = {createCases,getAllCases,caseStatusUpdate,getAllCustCases,deleteCases,sendCustSupportDisussEmail};