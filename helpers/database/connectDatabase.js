const mongoose = require('mongoose');

const conncetDatabase= () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("mongodb connection successful")
    })
    .catch(err=>{
        console.error(err)
    })

}

module.exports = conncetDatabase