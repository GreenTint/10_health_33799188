require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');

// Create the express application object
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser
app.use(express.urlencoded({ extended: true }));

// Public folder for css / client-side js
app.use(express.static(path.join(__dirname, 'public')));

// Create session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000 // 10 minutes
    }
}));

// Setup MySQL connection pool
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER, 
    password: process.env.HEALTH_PASSWORD, 
    database: process.env.HEALTH_DATABASE, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db; // make DB accessible in route files


// ROUTES
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const userRoutes = require('./routes/users');
app.use('/', userRoutes); 
// (login/logout do NOT need /users prefix for this project)

const activityRoutes = require('./routes/activities');
app.use('/', activityRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Fitness Tracker running on port ${port}`);
});
