const mongoose = require("mongoose");
const Data = require("./data.js");
 
const Listing = require("../models/Listing.js");

main().then(()=>{
    console.log("connection successful")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wonderlust")
}

const initdb = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(Data.Data);
    console.log(Data);
}

initdb();
