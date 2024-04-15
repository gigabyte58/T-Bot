// logger.js

const fs = require('fs');
const path = require('path');

const logger = (message) => {
    const logMessage = `[${new Date().toLocaleString()}] ${message}\n`;
    // Log to the console
    console.log(logMessage);
};

module.exports = logger;