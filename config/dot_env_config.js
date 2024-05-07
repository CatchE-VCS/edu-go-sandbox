const dotenv = require("dotenv");
const path = require("path");
const dotenvConfigOutput = dotenv.config(
    {
        path: path.join(__dirname, '../.env')
    }
);

module.exports = dotenvConfigOutput;