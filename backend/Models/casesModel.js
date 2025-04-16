const mongoose = require('mongoose');

const casesSchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    support : {
        type : String,
        required : true
    },
    priority : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        required : true
    },
},
{
    timestamps : true
}
)

const model = mongoose.model('Cases',casesSchema);
module.exports = model;