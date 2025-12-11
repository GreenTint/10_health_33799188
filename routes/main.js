const express = require("express");
const router = express.Router();

// Show home page
router.get("/", (req, res) => {
    res.render("home.ejs", { session: req.session });
});

// Show about page
router.get("/about", (req, res) => {
    res.render("about.ejs", { session: req.session });
});

module.exports = router;
