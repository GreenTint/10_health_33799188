const express = require("express");
const router = express.Router();

// Detect correct base path for localhost vs Goldsmiths
function getBase(req) {
    return req.headers.host.includes("doc.gold.ac.uk") ? "/usr/441" : "";
}

// Redirect users who are not logged in
function redirectLogin(req, res, next) {
    if (!req.session.userId) {
        req.session.returnTo = req.originalUrl;
        return res.redirect(getBase(req) + "/login");
    }
    next();
}

// Format MySQL date to YYYY-MM-DD
function formatDate(dateObj) {
    return dateObj.toISOString().substring(0, 10);
}

// Show list of activities
router.get("/activities", redirectLogin, (req, res, next) => {
    const sql = `
        SELECT * FROM activities
        WHERE user_id = ?
        ORDER BY date DESC
    `;

    db.query(sql, [req.session.userId], (err, rows) => {
        if (err) return next(err);

        const formatted = rows.map(r => ({
            ...r,
            date: formatDate(r.date)
        }));

        res.render("activities.ejs", {
            session: req.session,
            activities: formatted
        });
    });
});

// Show add activity form
router.get("/add-activity", redirectLogin, (req, res) => {
    res.render("add-activity.ejs", { session: req.session });
});

// Handle add activity submit
router.post("/add-activity", redirectLogin, (req, res, next) => {
    const { type, duration, calories, notes, date } = req.body;

    const sql = `
        INSERT INTO activities (user_id, type, duration, calories, notes, date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
        req.session.userId,
        type,
        duration,
        calories || null,
        notes || null,
        date
    ];

    db.query(sql, params, err => {
        if (err) return next(err);

        res.render("activity-added.ejs", {
            session: req.session,
            type,
            duration,
            calories,
            notes,
            date
        });
    });
});

// Show search page
router.get("/search", redirectLogin, (req, res) => {
    res.render("search.ejs", { session: req.session });
});

// Show search results
router.get("/search_result", redirectLogin, (req, res, next) => {
    const keyword = "%" + req.query.keyword + "%";

    const sql = `
        SELECT * FROM activities
        WHERE user_id = ?
        AND (type LIKE ? OR notes LIKE ?)
        ORDER BY date DESC
    `;

    db.query(sql, [req.session.userId, keyword, keyword], (err, rows) => {
        if (err) return next(err);

        const formatted = rows.map(r => ({
            ...r,
            date: formatDate(r.date)
        }));

        res.render("search_result.ejs", {
            session: req.session,
            searchResults: formatted,
            keyword: req.query.keyword
        });
    });
});

// Show stats page
router.get("/stats", redirectLogin, (req, res, next) => {
    const sql = `
        SELECT date, calories
        FROM activities
        WHERE user_id = ?
        ORDER BY date
    `;

    db.query(sql, [req.session.userId], (err, rows) => {
        if (err) return next(err);

        const labels = rows.map(r => formatDate(r.date));
        const values = rows.map(r => r.calories || 0);

        res.render("stats.ejs", {
            session: req.session,
            labels,
            values
        });
    });
});

module.exports = router;
