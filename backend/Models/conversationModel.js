const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    user : { type : String },
    date : { type : String},
    discuss : { type : String },
    message: { type : String, required : true },
    timestamp: { type : Date, default : Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;