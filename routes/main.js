const express = require("express");
const router = express.Router();

// HOME PAGE
router.get("/", (req, res) => {
    res.render("home.ejs", { session: req.session });
});

// ABOUT PAGE
router.get("/about", (req, res) => {
    res.render("about.ejs", { session: req.session });
});


// EXPORT
module.exports = router;
