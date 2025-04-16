const mongoose = require("mongoose");


const salesSchema = new mongoose.Schema({
    dealName : {
        type : String,
        required : true
    },
    companyName : {
        type : String,
        required : true
    },
    saleState : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    amount : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    time : {
        type : String,
        required : true
    },
    rep : {
        type : String,
        required : true
    }
},
{
    timestamps : true
}
);

const model = mongoose.model("Sale", salesSchema);
module.exports = model;