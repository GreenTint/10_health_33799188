const express = require("express");
const router = express.Router();

// LOGIN CHECK
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        req.session.returnTo = req.originalUrl;
        return res.redirect("/login");
    }
    next();
};

// LIST ACTIVITIES
router.get("/activities", redirectLogin, (req, res, next) => {
    const sql = `
        SELECT * FROM activities
        WHERE user_id = ?
        ORDER BY date DESC
    `;

    db.query(sql, [req.session.userId], (err, rows) => {
        if (err) return next(err);

        res.render("activities.ejs", {
            session: req.session,
            activities: rows
        });
    });
});

// ADD FORM
router.get("/add-activity", redirectLogin, (req, res) => {
    res.render("add-activity.ejs", { session: req.session });
});

// ADD SUBMIT
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

// SEARCH
router.get("/search", redirectLogin, (req, res) => {
    res.render("search.ejs", { session: req.session });
});

// RESULTS
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

        res.render("search_result.ejs", {
            session: req.session,
            searchResults: rows,
            keyword: req.query.keyword
        });
    });
});

// STATS PAGE
router.get("/stats", redirectLogin, (req, res, next) => {
    const sql = `
        SELECT date, calories 
        FROM activities
        WHERE user_id = ?
        ORDER BY date
    `;

    db.query(sql, [req.session.userId], (err, rows) => {
        if (err) return next(err);

        const labels = rows.map(r => r.date);
        const values = rows.map(r => r.calories || 0);

        res.render("stats.ejs", { session: req.session, labels, values });
    });
});

module.exports = router;
