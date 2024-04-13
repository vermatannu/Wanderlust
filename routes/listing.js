const express = require("express")
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner}= require("../middleware.js")
const multer= require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage: storage });


const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
};

const listingController = require("../controllers/listings.js")

// to new listing
router.get("/new", isLoggedIn, listingController.renderNewForm)

// Search Button
router.post("/destination",listingController.searchPlace);


// For Category listing
router.get("/category/:cate",listingController.category);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, 
 wrapAsync(listingController.createListing)
 );


router.route("/:id")
.get(wrapAsync(listingController.showListing))

.put(upload.single('listing[image]'), validateListing, isLoggedIn, isOwner,
    wrapAsync(listingController.updateForm))
.delete(isLoggedIn, wrapAsync(listingController.destroyForm));


// edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;
