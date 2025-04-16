const mongoose = require("mongoose");


const Connectdb = async () => {
    try {
        const connectionURi = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Host - Name : ${connectionURi.connection.host} & Db - Name : ${connectionURi.connection.name}`)
    } catch (error) {
        console.log(" Db error :",error)
        process.exit(1);
    }
}

module.exports = Connectdb;