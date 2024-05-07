const statData = require('../../model/statData');
const axios = require('axios');
const headers = require("../../const/headers");
const dotEnvConfig = require("../../config/dot_env_config");
const individualCompressedDataStat = (req, res) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);

    // call the api to validate the user for correct authorization
    axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_LEAVE_TYPE"]}?isStudentLeaveType=0&orgId=194`, { "headers":headers.header_with_token(userId, orgId, authorization)}).then((response) => {

        statData.find({
            userId: userId,
            organizationId: orgId
        }).then((data) => {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No stats found for this user"
                });
                return;
            }
            let userStatData = data[0];
            delete userStatData._id;
            delete userStatData.userId;
            delete userStatData.organizationId;
            delete userStatData.statCreatedAt;
            delete userStatData.statUpdatedAt;
            delete userStatData.__v;
            res.status(200).json(userStatData);
        }).catch((err) => {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving stats."
            });
        });
    }).catch((err) => {
        // console.log(err);
        if (err.response) {
            console.log(err.response.data);
        }
        res.status(401).json({
            message: "Unauthorized"
        });
    });
}


const overallCompressedDataStat = (req, res) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);

    console.log(authorization);
    console.log(userId);
    console.log(orgId);
    console.log(headers.header_with_token(userId, orgId, authorization));
    axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_LEAVE_TYPE"]}?isStudentLeaveType=0&orgId=194`, { "headers":headers.header_with_token(userId, orgId, authorization)}).then((response) => {

        // get all the stat data
        statData.find({}).then((data) => {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No stats found for this user"
                });
                return;
            }
            let compressedDataKiloBytes = 0;
            let actualDataKiloBytes = 0;
            let numberOfRequestsOverall = 0;
            data.forEach(
                (element) => {

                    compressedDataKiloBytes += element.compressedDataKiloBytes;
                    numberOfRequestsOverall += element.numberOfRequests;
                    // console.log(element.numberOfRequests);
                    actualDataKiloBytes += element.actualDataKiloBytes;
                }
            );
            res.status(200).json({
                compressedDataKiloBytes: compressedDataKiloBytes,
                actualDataKiloBytes: actualDataKiloBytes,
                numberOfRequests: numberOfRequestsOverall
            });
        }).catch((err) => {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving stats."
            });
        });
    }).catch((err) => {

        if (err.response) {
            console.log(err.response.data);
        }
        res.status(401).json({
            message: "Unauthorized"
        });
    });
}

module.exports = {individualCompressedDataStat, overallCompressedDataStat};