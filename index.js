require('dotenv').config();

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const port = 8000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Public folder for CSS and client-side assets
app.use(express.static(path.join(__dirname, 'public')));

// Create user session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // 10 minutes
}));

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Make DB accessible in route files
global.db = db;


// Load routes
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');

// Use routes
app.use('/', mainRoutes);
app.use('/', userRoutes);
app.use('/', activityRoutes);


// Start server
app.listen(port, () => {
    console.log(`Fitness Tracker running on port ${port}`);
});
