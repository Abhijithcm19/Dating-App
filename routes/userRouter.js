
const express = require('express');
const path = require('path');
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.hbs'));
});

// Contact Route
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/contact.hbs'));
});

// About Route
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.hbs'));
});

module.exports = router;