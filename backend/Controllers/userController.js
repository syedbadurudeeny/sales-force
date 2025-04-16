const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/userModel');
const Sale = require('../Models/salesModel')


const userRegister = asyncHandler( async(req,res)=>{
    const {username,email,role,password} = req.body;

    try {

        if(!username || !email || !role || !password){
            return res.status(400).json({message:"All fields are not empty"});
        }

        const finduser = await User.findOne({email});

        if(finduser){
            return res.status(400).json({message:"User already exists"});
        }else{
            const hashedPassword = await bcrypt.hash(password,10);

            const newuser = await User.create({
                username,
                email,
                role,
                password : hashedPassword
            })

            newuser.save();

            if(!newuser) res.status(400).json({message:"User not created"});

            return res.status(201).json({message:"Register successfull"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json("internal server error")
    }
});


const userLogin = asyncHandler( async(req,res)=>{
    const {email,role,password} = req.body;

    try {
        if(!email || !role || !password){
            return res.status(400).json({message:"All fields are not empty"});
        }

        const finduser = await User.findOne({email,role});

        if(finduser && await bcrypt.compare(password,finduser.password)){
            const accessToken = jwt.sign({
                    userData : {
                        email,
                        role,
                        password
                    }, 
                },
                process.env.SECRETPASSWORD,
                {expiresIn : "1d"}
            )

            return res.status(201).json({message:"Login successfull", user: {username : finduser.username,email,role,accessToken}});
        }else{
            return res.status(400).json({message:"User not found"})
        }

    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})


const getSalesRep = asyncHandler( async(req,res)=>{
    try {
        
        const salesRepNames = req.params.name;

        if(!salesRepNames) return res.status(400).json({message : "Something went wrong"});

        const getAllReps = await User.find({role : salesRepNames});

        if(!getAllReps) return res.status(400).json({message:"Sales rep not found"});

        return res.status(201).json({message : getAllReps});

    } catch (error) {
        console.log(error);
    }
})


const salesRepTasks = asyncHandler( async(req,res)=>{
    try {
        
        const salesRepName = req.params.name;

        if(!salesRepName) return res.status(400).json({message : "Something went wrong"});

        const salesRepTasks = await Sale.find({rep : salesRepName});

        if(!salesRepTasks) return res.status(400).json({message:"Sales rep not found"});

        return res.status(201).json({message : salesRepTasks});

    } catch (error) {
        console.log(error);
    }
})


const getSupportEng = asyncHandler( async(req,res)=>{
    try {
        
        const supportEngNames = req.params.name;

        if(!supportEngNames) return res.status(400).json({message : "Something went wrong"});

        const getAllSupportEng = await User.find({role : supportEngNames});

        if(!getAllSupportEng) return res.status(400).json({message:"Support Eng not found"});

        return res.status(201).json({message : getAllSupportEng});

    } catch (error) {
        console.log(error);
    }
})


module.exports = {userRegister,userLogin,getSalesRep,salesRepTasks,getSupportEng};