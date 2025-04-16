const asyncHandler = require('express-async-handler');
const Rating = require('../Models/feedbackRatingModel');


const createRating = asyncHandler( async(req,res)=>{
    try {
        
        const {oppertunity,rating,companyName} = req.body;

        if(!oppertunity || !rating || !companyName){
            return res.status(400).json({message : "All fields are not empty"});
        }

        const newrating = await Rating.create({
            oppertunity,
            rating,
            companyName
        })

        await newrating.save();

        if(!newrating) return res.status(400).json({message : "Something went wrong"});

        return res.status(201).json({message : "Rating added !.."})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server error"});
    }
});


const getCompanyRating = asyncHandler( async(req,res)=>{
    const companyName = req.params.name;

    try {
        if(!companyName){
            return res.status(400).json({message:"Company name not found"});
        }

        const getRating = await Rating.find({companyName:companyName});

        if(!getRating){
            return res.status(400).json({message:"Rating not found"});
        }

        return res.status(200).json({message:getRating})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"});
    }
})


module.exports = {createRating,getCompanyRating};