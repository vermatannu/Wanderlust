const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema"); // Correct the import path to schema.js
const ExpressError = require("../utils/ExpressError");


module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});  
    res.render("./listings/index.ejs", {allListings})
};

module.exports.renderNewForm =  (req,res)=>{
    res.render('./listings/new.ejs')
};

module.exports.category = async(req,res)=>{
    let {cate} = req.params;
    const allListings = await Listing.find({category:cate});
    if(allListings.length!=0){
        res.render("./listings/index.ejs",{allListings});
    }else{
        req.flash("error","This category does not have any listing");
        res.redirect("/listings");
    }
}

module.exports.searchPlace = async(req,res)=>{
    let {place} = req.body;
    let arr = place.split(",");
    const allList = await Listing.find();
    let allListings = allList.filter((list)=>list.location.split(",")[0] === arr[0]);
    if(allListings.length!=0){
        res.render("./listings/index.ejs",{allListings});
    }else{
        req.flash("error","This Destination does not have any listing");
        res.redirect("/listings");
    }
}


module.exports.showListing =async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate('reviews')
        .populate('owner')
        .populate({ path: "reviews", populate: { path: "author" } }); // Added the missing closing bracket here
    
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist"); // Corrected the spelling of "does"
        return res.redirect("/listings"); // Added return statement here
    }
    
    res.render("./listings/show.ejs", { listing });
}



module.exports.createListing = async(req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        
        await newListing.save();
        
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating new listing:", error);
        req.flash("error", "Failed to create new listing");
        res.redirect("/listings/new");  // Redirect to new listing form with error message
    }
};



module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doed not exist")
        res.redirect("/lisings");
    }
    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("upload", "upload/w_300");
    res.render("./listings/edit.ejs", {listing, originalImageUrl})
}

module.exports.updateForm = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyForm = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing Deleted");
    res.redirect("/listings");
}