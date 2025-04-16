const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, 'Enter user name']
    },
    email : {
        type : String,
        required : [true, 'Enter user email']
    },
    role : {
        type : String,
        required : [true, 'Enter user role']
    },
    password : {
        type : String,
        required : [true, 'Enter user password']
    }
},
{
    timestamps : true
}
);


const userModel = mongoose.model('User',userSchema);

module.exports = userModel