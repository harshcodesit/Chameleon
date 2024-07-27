const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {type :String,
        required: true
    },
    description : String,
    image: {
        type: Object,
        default : "link",
    set : (v)=>v===""?"link":v},
    price : Number,
    location: String,
    country: String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref : "User"
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing