# Fitness Tracker (Node.js + Express + MySQL)

A lightweight fitness-tracking web app built with Node.js, Express, EJS, and MySQL.  
It provides user authentication, activity logging, search, and basic statistics visualization.  
The project demonstrates a clean, maintainable full-stack architecture suitable for small to mid-scale apps.

---

## Key Techniques Used

### Session-based Authentication
The app uses [`express-session`](https://www.npmjs.com/package/express-session) to maintain persistent login sessions.  
User credentials are secured using [`bcrypt`](https://www.npmjs.com/package/bcrypt) for salted hashing.

### Templating with EJS
Pages are generated server-side using EJS templates with partials for header and footer reuse.  
EJS supports embedded JavaScript in HTML: https://ejs.co/.

### Environment-based Configuration
Runtime configuration is handled through `.env` using [`dotenv`](https://www.npmjs.com/package/dotenv).  
Environment variables allow switching between local development and Goldsmiths server deployment.

### Simple Date Formatting
Presentation logic avoids raw JS date strings using controlled formatting at render time or SQL-level formatting.  
MDN Date reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date.

### Chart Rendering via Chart.js
Statistics are rendered client-side using [Chart.js](https://www.chartjs.org/).  
This provides lightweight data visualization without introducing heavy dependencies.

---

## Interesting Non-Obvious Tools and Libraries

| Technology | Why It's Interesting |
|-----------|----------------------|
| **Chart.js** | Minimal setup for client-side visualisation. |
| **Express Session Middleware** | Demonstrates login persistence without JWT complexity. |
| **MySQL2 (query interface)** | Simple relational persistence with parameterised queries. |
| **EJS Partials** | Effective approach to shared page structure in server-rendered apps. |

---

## Fonts & External Assets

The UI uses native system fonts for performance.  
Chart.js is loaded via CDN and requires no local installation.

---

## Project Structure

```txt
/
├── index.js
├── package.json
├── package-lock.json
├── .env                 # Environment config (ignored by git)
├── create_db.sql
├── insert_test_data.sql
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/          # Optional UI assets
│
├── routes/
│   ├── main.js          # Home + About
│   ├── users.js         # Auth: signup, login, logout
│   └── activities.js    # Activity logging, search, stats
│
└── views/
    ├── partials/
    ├── home.ejs
    ├── about.ejs
    ├── login.ejs
    ├── signup.ejs
    ├── activities.ejs
    ├── add-activity.ejs
    ├── activity-added.ejs
    ├── search.ejs
    └── search_result.ejs
