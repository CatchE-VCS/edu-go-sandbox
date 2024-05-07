const rateLimit = require("express-rate-limit");
const dotenv = require('dotenv');
const path = require('path');
const dotenvConfigOutput = dotenv.config(
    {
        path: path.join(__dirname, '../.env')
    }
);
// Rate limiting middleware (to prevent brute-force attacks)
const limiter = rateLimit({
    windowMs: dotenvConfigOutput.parsed["RATE_LIMIT_EXPIRES"]*1000,
    max: dotenvConfigOutput.parsed["RATE_LIMIT"], // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later"
});

module.exports = limiter;