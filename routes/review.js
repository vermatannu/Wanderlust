const express = require("express")
const router = express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isreviewAuthor} = require("../middleware.js");
const review = require("../models/review.js");


const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
};

const reviewController = require("../controllers/reviews.js")

// Reviews
// Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// delete routes
router.delete("/:reviewId",
isLoggedIn,
isreviewAuthor,
wrapAsync(reviewController.destroyReview)
);
module.exports = router;