const mongoose = require("mongoose");


const dealsSchema = new mongoose.Schema({
    dealName : {
        type : String,
        required : true
    },
    companyName : {
        type : String,
        required : true
    },
    dealState : {
        type : String,
        required : true
    }
},
{
    timestamps : true
}
);

const model = mongoose.model("Deal", dealsSchema);
module.exports = model;