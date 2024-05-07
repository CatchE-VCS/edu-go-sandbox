const headers = require("../../const/headers");
const axios = require("axios");
const removeNullKeys = require("../../utils/delete_null_keys");
const dotEnvConfig = require("../../config/dot_env_config");
const getAttendance = async (req, res) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);
    if (!authorization) {
        res.status(401).send("Unauthorized");
    } else {
    await axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_ATTENDANCE"]}?isDateWise=false&termId=0&userId=${userId}&y=0`,{
        "headers": headers.header_with_token(userId, orgId, authorization),
    }).then(function(response){
        removeNullKeys(response.data);
        delete response.data.businessDays;
        delete response.data.attendanceCopy;
        delete response.data.stdSubAtdDetails.subjects;
        response.data.stdSubAtdDetails.studentSubjectAttendance[0].subjects.forEach(element => {

            element.percentageAttendance = parseFloat(element.percentageAttendance.toFixed(2));
        });
        response.data.stdSubAtdDetails.overallPercentage = parseFloat(response.data.stdSubAtdDetails.overallPercentage.toFixed(2));
        console.log("Sending data");
        res.send(response.data);
    }).catch(function(error){
        if (error.response === undefined) {
            console.log(error);
            res.status(400).send({"message": "Bad Request"});
            return;
        }
        console.log(error.response.data);
        res.status(400).send(error.response.data);
    });
    }

};

const getUserDetails = async (req, res,next) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);

    if (!authorization) {
        res.status(401).send("Unauthorized");
    } else {
        // console.log(authorization);
        // authorization = authorization.split(' ')[1];
        // console.log(authorization);
        await axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_USER_PROFILE"]}?Id=${userId}&val=0&val1=0&val2=0&val3=0`, {
            "headers": headers.header_with_token(userId, orgId, authorization),
        }).then(function (response) {
            delete response.data.normalSubjectsList;
            delete response.data.stuSubjectList;
            res.send(response.data);
        }).catch(function (error) {
            console.log(error.response.data);
            res.status(400).send(error.response.data);
        });
    }
}

const getPDPAttendance = async (req, res) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);
    const admissionNumber = req.query.admissionNumber;
    if (!authorization) {
        res.status(401).send("Unauthorized");
    } else {
        // console.log(token);
        await axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_PDP"]}?admissionNumber=${admissionNumber}&type=7`, {
            "headers": headers.header_with_token(userId, orgId, authorization),
        }).then(function (response) {
            
            console.log("Sending data");
            res.send(response.data);
        }).catch(function (error) {
            console.log(error.response);
            res.status(400).send(error.response);
        });
    }
}


module.exports = {getAttendance,getUserDetails, getPDPAttendance};