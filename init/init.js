const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/chameleon');
}
main().then(()=>{
    console.log("connected to the database")
}).catch(err =>{
    console.log(err);
});

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: "66a414171ee072642f39ae8b"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();