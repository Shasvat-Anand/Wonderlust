const express = require("express");
const app = express();
const Listing = require("./models/Listing")

const ejs = require("ejs");

const ejsMate = require('ejs-mate')
 
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine("ejs", ejsMate);

const methodOverride = require("method-override");
app.use(methodOverride("_method"))

app.use(express.static("public"));

app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require("mongoose");

const { clearScreenDown } = require("readline");

main().then(()=>{
    console.log("connection successful")
})
.catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wonderlust")
}

app.get("/", (req, res )=>{
    res.send("working");
})

// app.get("/sampledata", async (req, res)=>{
//     const data1 =  new Listing({
//         title : "House on sold",
//         description: "sweet home",
//         price: 6000,
//         location: "Basti",
//         country: "India"
//     })
//     await data1.save();
//     res.send("it working")
// })

//  go to create new listing route
app.get("/listing/new", (req, res)=>{
    res.render("new.ejs");
})

// editing the listing
app.put("/listing/:id", async (req, res)=>{
    let {id} = req.params;
 
    const {title, image, description, price, location, country} = req.body;
    

    await Listing.findByIdAndUpdate(id,{title, image, description, price, location, country}, {new : true});
    res.redirect(`/listing/${id}`)
})

//  deleting the list
app.delete("/listing/:id/delete", async (req, res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listing`);
})

// show listing route 
app.get("/listing/:id",async (req, res)=>{
    let {id} = req.params;
    let list =  await Listing.findById(id);
   
    res.render("show.ejs", {list})
})

// create new listing  route 
app.post("/listing", async (req, res)=>{   
    
    let {n_title, n_description , n_price , n_image, n_location, n_country} = req.body;

    const new_listing = new Listing({
        title : n_title,
        description : n_description,
        price : n_price,
        image: n_image,
        location : n_location,
        country : n_country

    })
   
    await new_listing.save();
    res.redirect("/listing")
})

// edit form route
app.get("/listing/:id/edit",async (req, res)=>{
    let {id} = req.params;   
    let data =  await Listing.findById(id);
    res.render("editform.ejs", {data})

})




//  LIsting route
app.get("/listing",async (req, res )=>{
    const data = await Listing.find({})
     
    
    res.render("listing.ejs", {data})
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})