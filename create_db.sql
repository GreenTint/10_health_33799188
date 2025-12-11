-- Create database script for Fitness Progress Tracker

-- Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    duration INT NOT NULL,              -- minutes or reps depending on activity
    calories INT,                       -- optional
    notes TEXT,
    date DATE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
);

-- CREATE APPLICATION USER FOR MARKING ENVIRONMENT
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';

FLUSH PRIVILEGES;
