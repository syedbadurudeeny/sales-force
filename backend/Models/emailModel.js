const mongoose = require('mongoose');


const emailSchema = new mongoose.Schema({
    to : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    }
},
{
    timestamps : true
}
);


const model = mongoose.model('Email',emailSchema);
module.exports = model;