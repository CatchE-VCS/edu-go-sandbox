const axios = require("axios");
const querystring = require('querystring');
const dotEnvConfig = require("../../config/dot_env_config");
const apiUrl = dotEnvConfig.parsed["API_URL"] + dotEnvConfig.parsed["ROUTE_LOGIN"];
const headers = require('../../const/headers');
const login = async (req, res, next) => {
        console.log(req.body);
        console.log(req.headers);
        const username = req.body.username;
        const password = req.body.password;
        // check if username and password are string and not empty
        if (typeof username !== 'string' || typeof password !== 'string') {
            res.status(401).send("Unauthorized");
        } else if (!username || !password) {
            res.status(401).send("Unauthorized");
        }
        else if (username.length < 1) {
            res.status(401).send("Empty Username");
        } else if (password.length < 1) {
            res.status(401).send("Empty Password");
        } else {

            const userDataPayload = {
                grant_type: 'password',
                username: username,
                password: password,
                remember: true
            };


            const encodedUserData = querystring.stringify(userDataPayload);

            await axios.post(apiUrl, encodedUserData, {headers: headers.header_without_token_login})
                .then(async response => {
                    // Handle the response
                    delete response.data["X_Token"];
                    delete response.data[".issued"];
                    delete response.data["PChangeSetting"];
                    delete response.data["PChangeStatus"];
                    delete response.data["SessionId"];
                    response.data["admissionNumber"] = username.split(response.data["X-ContextId"])[0];
                    res.status(200).json(response.data);
                }).catch(error => {
                    // Handle the error
                    console.error(error.response.data);
                    res.send(error.response.data);
                });
        }
}

const forgotPassword = async (req, res, next) => {

    if (!req.body.admissionNumber || !req.body.dob) {
        res.status(400).send("Bad Request");
        return;
    }
    const admissionNumber = req.body.admissionNumber;
    const dob = req.body.dob;
    const userDataPayload = {"message":"Dear ####, Please find your new password; Username- #### , New Password- #### \n ####","templateId":1,"status":false,"admissionNumber":admissionNumber,"dob":dob};
    const encodedUserData = querystring.stringify(userDataPayload);

    await axios.post(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_FORGOT_PASSWORD"]}`,
        encodedUserData, { headers: headers.header_without_token_login }).then(
        (response) => {
            res.status(200).send(response.data);
        }
    ).catch(
        (err) => {

            if (err.response === undefined) {
                res.status(500).send("Internal Server Error");
                return;
            }
            if (err.response.data.message === "Invalid Admission Number or Date of Birth") {
                res.status(404).send(err.response.data);
                return;
            }
            res.status(400).send(err.response.data);
        }
    );
}

module.exports = {login, forgotPassword}