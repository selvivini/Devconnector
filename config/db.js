const mongoose = require('mongoose') ;
const config = require('config');
const db = config.get('mongoURI');


const ConnectDB = async() => {
    try{
await mongoose.connect(db, {useNewUrlParser:true,useCreateIndex:true} ); 
console.log('mongodb connected');
    } catch(err){
    console.error(err.message);
    //Exit the process with failure
    process.exit(1);
    }
}

module.exports = ConnectDB;