const mongoose = require("mongoose");
const initData = require('./data.js');
const Listing = require('../models/listing.js');


let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    // to add owner in listing
    initData.data = initData.data.map((obj)=>({...obj, owner:'6609729b3b54bc986f956a0b'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();