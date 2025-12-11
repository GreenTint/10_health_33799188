const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// PASSWORD VALIDATION FUNCTION
function validPassword(pw) {
    // Must contain: lowercase, uppercase, number, special character, and be 8+ chars
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pw);
}

/* ------------------------------------------------------
 * LOGIN PAGE
 * ------------------------------------------------------ */
router.get("/login", (req, res) => {
    res.render("login.ejs", { session: req.session, error: null });
});

/* ------------------------------------------------------
 * SIGNUP PAGE
 * ------------------------------------------------------ */
router.get("/signup", (req, res) => {
    res.render("signup.ejs", { session: req.session, error: null });
});

/* ------------------------------------------------------
 * HANDLE LOGIN
 * ------------------------------------------------------ */
router.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, rows) => {
        if (err) return next(err);

        if (rows.length === 0) {
            return res.render("login.ejs", {
                session: req.session,
                error: "Invalid username or password."
            });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.render("login.ejs", {
                session: req.session,
                error: "Invalid username or password."
            });
        }

        // success
        req.session.userId = user.id;
        req.session.username = user.username;

        const redirectTo = req.session.returnTo || "/";
        delete req.session.returnTo;

        return res.redirect(redirectTo);
    });
});

/* ------------------------------------------------------
 * HANDLE SIGNUP
 * ------------------------------------------------------ */
router.post("/signup", async (req, res, next) => {
    const { username, password } = req.body;

    // Validate password strength
    if (!validPassword(password)) {
        return res.render("signup.ejs", {
            error: "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
            session: req.session
        });
    }

    // Check if username exists
    const checkQuery = "SELECT * FROM users WHERE username = ?";
    db.query(checkQuery, [username], async (err, results) => {
        if (err) return next(err);

        if (results.length > 0) {
            return res.render("signup.ejs", {
                error: "Username already taken.",
                session: req.session
            });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO users (username, password_hash)
            VALUES (?, ?)
        `;

        db.query(insertQuery, [username, hash], (err, result) => {
            if (err) return next(err);

            // Auto-login after signup
            req.session.userId = result.insertId;
            req.session.username = username;

            res.redirect("/");
        });
    });
});

/* ------------------------------------------------------
 * LOGOUT
 * ------------------------------------------------------ */
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect("/");
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

module.exports = router;
