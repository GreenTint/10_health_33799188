const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Detect correct base path (localhost vs Goldsmiths)
function getBase(req) {
    return req.headers.host.includes("doc.gold.ac.uk") ? "/usr/441" : "";
}

// Validate password strength
function validPassword(pw) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pw);
}

// Show login page
router.get("/login", (req, res) => {
    res.render("login.ejs", { session: req.session, error: null });
});

// Show signup page
router.get("/signup", (req, res) => {
    res.render("signup.ejs", { session: req.session, error: null });
});

// Handle login
router.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, rows) => {
        if (err) return next(err);
        if (rows.length === 0)
            return res.render("login.ejs", { session: req.session, error: "Invalid username or password." });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match)
            return res.render("login.ejs", { session: req.session, error: "Invalid username or password." });

        // Save session
        req.session.userId = user.id;
        req.session.username = user.username;

        const base = getBase(req);
        const redirectTo = req.session.returnTo ? base + req.session.returnTo : base + "/";

        delete req.session.returnTo;
        res.redirect(redirectTo);
    });
});

// Handle signup
router.post("/signup", async (req, res, next) => {
    const { username, password } = req.body;

    if (!validPassword(password)) {
        return res.render("signup.ejs", {
            session: req.session,
            error: "Password must include uppercase, lowercase, number, special character, and be at least 8 characters."
        });
    }

    const checkQuery = "SELECT * FROM users WHERE username = ?";
    db.query(checkQuery, [username], async (err, rows) => {
        if (err) return next(err);
        if (rows.length > 0)
            return res.render("signup.ejs", { session: req.session, error: "Username already taken." });

        const hash = await bcrypt.hash(password, 10);
        const insertQuery = "INSERT INTO users (username, password_hash) VALUES (?, ?)";

        db.query(insertQuery, [username, hash], (err, result) => {
            if (err) return next(err);

            // Auto-login
            req.session.userId = result.insertId;
            req.session.username = username;

            const base = getBase(req);
            res.redirect(base + "/");
        });
    });
});

// Logout
router.get("/logout", (req, res) => {
    const base = getBase(req);

    req.session.destroy(err => {
        if (err) return res.redirect(base + "/");
        res.clearCookie("connect.sid");
        res.redirect(base + "/");
    });
});

module.exports = router;
