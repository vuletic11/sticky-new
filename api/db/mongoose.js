// This file will handle connection logic to the MongoDB database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://0.0.0.0:27017/StickyNew', {useNewUrlParser: true}).then(()=>{
    console.log("Connected to MongoDb successfully");
}).catch((e) =>{
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});



module.exports= {
    mongoose
};
    
