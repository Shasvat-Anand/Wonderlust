const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true

    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://i.pinimg.com/736x/3c/d6/b0/3cd6b0a044375c3a1b9da0a8c04e91dd.jpg",
        set: (v) =>
            v === ""
                ? "https://i.pinimg.com/736x/3c/d6/b0/3cd6b0a044375c3a1b9da0a8c04e91dd.jpg"
                : v
    },
    price: {
        type: Number,
        require: true
    },
    location: {
        type: String
    },
    country: {
        type: String
    }



})

const Listing = new mongoose.model("Listing", ListingSchema);

module.exports = Listing;

