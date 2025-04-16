const asyncHandler = require("express-async-handler");
const Sale = require('../Models/salesModel')
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const User = require('../Models/userModel');

//post
const customerSales = asyncHandler( async(req,res)=>{
    const {userSale} = req.body;

    try {
        if(!userSale){
            return res.status(400).json({message: "Sale not found"})
        }
    
        const storeSale = await Sale.create({
            dealName : userSale.dealName,
            companyName : userSale.companyName,
            saleState : userSale.saleState,
            location : userSale.location,
            amount : userSale.amount,
            date : userSale.date,
            time : userSale.time,
            rep : userSale.rep
        })
    
        storeSale.save();

        return res.status(200).json({message:"Sale added"})
    
    } catch (error) {
        console.log("Deal :", error)
        return res.status(400).json({message: "Deal not added - something went wrong"})
    }

})

//update
const customerSaleStateUpdate = asyncHandler( async(req,res)=>{
    const saleId = req.params.id
    const {state_of_sale} = req.body;

    try {
        if(!saleId || !state_of_sale){
            return res.status(400).json({message : "Sale id not found"});
        }

        const updateSaleState = await Sale.findByIdAndUpdate({_id:saleId},{
            saleState : state_of_sale
        },{new:true});

        updateSaleState.save();

        return res.status(200).json({message:"Sale state updated ", updateSaleState})

    } catch (error) {
        console.log('Sale state :', error);
        return res.status(400).json({message:"Sale state not updated - something went wrong "})
    }
})

//delete

const customerSaleStateDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        // Validate the ID format
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Sale ID" });
        }

        const deleteSale = await Sale.findByIdAndDelete(id);

        if (!deleteSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        return res.status(200).json({ message: "Sale successfully deleted", deleteSale });
    } catch (error) {
        console.log("sale delete error: ", error);
        return res.status(500).json({ message: "Server error" });
    }
});


//get
const getSaleDetail = asyncHandler( async(req,res)=>{
    const companyName = req.params.cname;

    try {
        if(!companyName){
            return res.status(400).json({message:"Company name not found"});
        }

        const getSalesCompany = await Sale.find({companyName:companyName});

        if(!getSalesCompany){
            return res.status(400).json({message:"Sales not found"});
        }

        return res.status(200).json({message:getSalesCompany})

    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"Sale detail not found"})
    }
});


const sendRepDisussEmail = asyncHandler( async(req,res)=>{
    try {
        const { repname } = req.body;
        console.log("repname : ",repname)

            let sent_mail = ""
            const findRep = await User.findOne({username : repname});

            if(findRep){
                sent_mail = findRep.email
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
                text: "About a sale"
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


module.exports = {customerSales,customerSaleStateUpdate,getSaleDetail,customerSaleStateDelete,sendRepDisussEmail};