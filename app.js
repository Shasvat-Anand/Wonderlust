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

 


// Required WrapAsync
const WrapAsync = require("./util/WrapAsync.js");

//  Required Express Error which handle mongoose error
const ExpressError = require("./util/ExpressError.js")


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
app.put("/listing/:id", WrapAsync( async (req, res)=>{
    let {id} = req.params;
 
    // const {title, image, description, price, location, country} = req.body;
    const listing = req.body.listing;
    

    // await Listing.findByIdAndUpdate(id,{title, image, description, price, location, country}, {new : true});
    await Listing.findByIdAndUpdate(id, req.body.listing, {new : true});
    res.redirect(`/listing/${id}`)
}))

//  deleting the list
app.delete("/listing/:id/delete",WrapAsync( async (req, res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listing`);
}))

// show listing route 
app.get("/listing/:id", WrapAsync(async (req, res)=>{
    let {id} = req.params;
    let list =  await Listing.findById(id);
   
    res.render("show.ejs", {list})
}))

// create new listing  route 
app.post("/listing", WrapAsync( async (req, res)=>{   
    
    // let {n_title, n_description , n_price , n_image, n_location, n_country} = req.body;

    if(!req.body.listing){
        throw new ExpressError (404, "Send invalid data for listing")
    }
    let newlisting = new Listing(req.body.listing);

    // const new_listing = new Listing({
    //     title : n_title,
    //     description : n_description,
    //     price : n_price,
    //     image: n_image,
    //     location : n_location,
    //     country : n_country

    // })
   
    await newlisting.save();
    res.redirect("/listing")
}))

// edit form route
app.get("/listing/:id/edit",WrapAsync( async (req, res)=>{
    let {id} = req.params;   
    let data =  await Listing.findById(id);
    res.render("editform.ejs", {data})

}))




//  LIsting route
app.get("/listing",WrapAsync( async (req, res )=>{
    const data = await Listing.find({})
     
    
    res.render("listing.ejs", {data})
}))


// handle General Error in from sever side.

app.use((err, req, res ,next)=>{
    res.send("Something went Wrong");
})


 

//  handle expresserror class for mongosh error
app.use((err, req, res, next)=>{
    let{status = 500, message = "Something went wrong!"} = err;
    res.status(status).send(message);
})



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})