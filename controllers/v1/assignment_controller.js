const axios = require("axios");
const headers = require("../../const/headers");
const dotEnvConfig = require("../../config/dot_env_config");

const getAssignments = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);
    if (!authorization) {
        res.status(401).send("Unauthorized");
        return;
    }
    await  axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_STUDENT_ASSIGNMENT"]}`,{headers: headers.header_with_token(userId,orgId,authorization)}).then(function(response){
        res.send(response.data);
    }).catch(function(error){
        console.log(error);
        res.send(error);
    });
}

const postAssignment = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);
    const data = req.body;
    try {
        await axios.post(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_STUDENT_ASSIGNMENT"]}`, {
            "textResponse": data.textResponse,
            "blobIdList": data.blobIdList,
            "assignmentId": data.assignmentId
        }, {headers: headers.header_with_token(userId, orgId, authorization)}).then(function (response) {
            if (response.status === 201) {
                console.log("Assignment posted successfully");
                res.status(200).send("Assignment posted successfully");
            } else {
                console.log("Assignment not posted");
                console.log(response.data);
                res.status(200).send("Assignment not posted");
            }
        }).catch(function (error) {
            if (error.response === undefined) {
                console.log(error);
                res.status(400).send({"message": "Bad Request"});
            } else {
                console.log(error.response.data);
                res.status(400).send(error.response.data);
            }
        });
    } catch (e) {
        console.log(e);
        res.status(400).send({"message": "Bad Request"});
    }
}

module.exports = {getAssignments, postAssignment}