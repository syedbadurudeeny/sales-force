const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    oppertunity : {
        type : String,
        required : true
    },
    rating : {
        type : Number || String,
        required : true
    },
    companyName : {
        type : String,
        required : true
    }
},
{
    timestamps : true
}
);


const model = mongoose.model("Rating",ratingSchema);
module.exports = model