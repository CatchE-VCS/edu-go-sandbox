
const statData = require("../../model/statData");
const headers = require("../../const/headers");
const axios = require("axios");
const removeNullKeys = require("../../utils/delete_null_keys");
const dotEnvConfig = require("../../config/dot_env_config");

const userArray = [];
const dailyUserArray = [];
let dailyCount = 0;
let newUserCount = 0;
let date = new Date();

const getAttendance = async (req, res) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);
    if (date.getDate() !== new Date().getDate()) {
        newUserCount = 0;
        dailyCount = 0;
        dailyUserArray.length = 0;
        date = new Date();
    }
    if (userArray.includes(userId)) {
       console.log("Already requested");
    } else {
        userArray.push(userId);
        dailyCount++;
    }
    if (!dailyUserArray.includes(userId)) {
        dailyUserArray.push(userId);
        newUserCount++;
    }
    if (!authorization) {
        res.status(401).send("Unauthorized");
    }
    const token = authorization.split(' ')[1];
    await axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_ATTENDANCE"]}?isDateWise=false&termId=0&userId=${userId}&y=0`,{
        "headers": headers.header_with_token(userId, orgId, authorization),
    }).then(function(response){
        // calculate bytes of data received
        const headersString = JSON.stringify(response.headers);
        const bodyString = JSON.stringify(response.data);
        const headerBytes = Buffer.byteLength(headersString, 'utf8');
        const bodyBytes = Buffer.byteLength(bodyString, 'utf8');

        if (response.data === null || response.data === undefined || response.data === []) {
            res.status(400).send("Bad Request");
        }
        else if (orgId === 194)
            {
        removeNullKeys(response.data);
        delete response.data.businessDays;
        delete response.data.attendanceCopy;
        delete response.data.stdSubAtdDetails.subjects;
        response.data.attendanceData.forEach(element => {
            delete element.orgnizationId;
            delete element.absentCount;
            delete element.profilePictureId;
            delete element.batchId;
            delete element.randomPresent;
            delete element.lectureAbsentId;
            delete element.sequence;
            delete element.masterSubjectId;
            delete element.newBatchId;
            delete element.uiMode;
            delete element.totalPresent;
            delete element.totalAbsent;
            delete element.studentAbsentCount;
            delete element.repeatAttendance;
            delete element.inoutMode;
            delete element.userGroupId;
            delete element.flag;
            delete element.comment;
            delete element.attendeeUserID;
            delete element.organizationId;
            delete element.attandanceType;
        });
        response.data.extraLectures.forEach(element => {
            delete element.orgnizationId;
            delete element.organizationId;
            delete element.absentCount;
            delete element.profilePictureId;
            delete element.batchId;
            delete element.randomPresent;
            delete element.lectureAbsentId;
            delete element.sequence;
            delete element.masterSubjectId;
            delete element.newBatchId;
            delete element.uiMode;
            delete element.totalPresent;
            delete element.totalAbsent;
            delete element.studentAbsentCount;
            delete element.repeatAttendance;
            delete element.inoutMode;
            delete element.userGroupId;
            delete element.flag;
            delete element.comment;
            delete element.attendeeUserID;
            delete element.attandanceType;
            delete element.attendanceID;
            delete element.markedBy;
            delete element.attendanceLable;
            delete element.css;
        });
        response.data.stdSubAtdDetails.studentSubjectAttendance[0].subjects.forEach(element => {
            delete element.subjectMasterId;
            delete element.actualSubjectId;
            delete element.subjectType;
            delete element.conversionMark;
            delete element.isSubjectSeleted;
            delete element.sequence;
            delete element.subjectMappingId;
            delete element.courseContent
            delete element.isAttendaceFilled;
            delete element.isExamDateSheetCreated;
            delete element.isSubjectTeacher;
            delete element.averagePresent;
            delete element.averageTotal;
            delete element.subjectGroupId;
            delete element.subSubjectId;
            delete element.totalExtraLeactureForSubject;
            delete element.presentInExtraLeactureForSubject;
            delete element.absentInExtraLeactureForSubject;
            delete element.otherAttendance;
            delete element.isAdditionalSubject;
            delete element.isTimeTableSubject;
            delete element.groupName;
            delete element.subject;
            element.percentageAttendance = parseFloat(element.percentageAttendance.toFixed(2));
        });

        response.data.stdSubAtdDetails.overallPercentage = parseFloat(response.data.stdSubAtdDetails.overallPercentage.toFixed(2));
        console.log("Sending data");
                const actualDataBytes = (bodyBytes + headerBytes)/ 1024;

                response.data.compressedDataKiloBytes = (Buffer.byteLength(JSON.stringify(response.data), 'utf8') + headerBytes) / 1024;
                response.data.actualDataKiloBytes = actualDataBytes;


        res.send(response.data);

        statData.find({ userId: userId, organizationId: orgId }).then((data) => {
            if (data.length === 0) {
                const newStatData = new statData({
                    compressedDataKiloBytes: response.data.compressedDataKiloBytes,
                    actualDataKiloBytes: actualDataBytes,
                    numberOfRequests: 1,
                    // statCreatedAt: Date.now(),
                    // statUpdatedAt: Date.now(),
                    token: token,
                    organizationId: orgId,
                    userRole: "student",
                    userId: userId,
                });
                newStatData.save().then((data) => {
                    console.log("New stat data created");
                }).catch((err) => {
                    console.log(err);
                });
            }
            else {
                data[0].compressedDataKiloBytes += response.data.compressedDataKiloBytes;
                data[0].actualDataKiloBytes += actualDataBytes;
                data[0].numberOfRequests += 1;
                // data[0].statUpdatedAt = Date.now();
                data[0].save().then((data) => {
                    console.log("Stat data updated");
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
            // Current Date Time in UTC
            let currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(currentDateTime);
        }
        else
            {
            response.data.forEach(element => {
                delete element.departmentId;
                delete element.colour;
                delete element.leaveTypeString;
                delete element.categoryId;
                delete element.attendanceLable;
                delete element.sequence;
                delete element.attendeeUserID;
                delete element.batchId;
                delete element.organizationId;
                delete element.leaveTypeId;
                delete element.comment;
                delete element.attandanceType;
                delete element.subSubjectId;
                delete element.adjustmentMode;
                delete element.isHalfDay;
                delete element.message;
                delete element.message1;
                delete element.isLeave;
                delete element.isDeleted;
                delete element.businessDays;
                delete element.templateId;
                delete element.dateTimeStampIns;
                delete element.dateTimeStamp;
                delete element.firstClassAttendance;
                delete element.instituteMasterId;
                delete element.outDateTime;
                delete element.attandeeName;
                delete element.absentLecture;
                delete element.subjectName;
                delete element.attendanceCount;
                    delete element.isEmployeeAttendance;
            });
            console.log("Sending data");

            const actualDataBytes = (bodyBytes + headerBytes)/ 1024;

            const compressedDataBytes = (Buffer.byteLength(JSON.stringify(response.data), 'utf8') + headerBytes) / 1024;

            res.send({"attendanceData": response.data, "compressedDataKiloBytes": compressedDataBytes, "actualDataKiloBytes": actualDataBytes});

            statData.find({ userId: userId, organizationId: orgId }).then((data) => {
                if (data.length === 0) {
                    const newStatData = new statData({
                        compressedDataKiloBytes: compressedDataBytes,
                        actualDataKiloBytes: actualDataBytes,
                        numberOfRequests: 1,
                        // statCreatedAt: Date.now(),
                        // statUpdatedAt: Date.now(),
                        token: token,
                        organizationId: orgId,
                        userRole: "student",
                        userId: userId,
                    });
                    newStatData.save().then((data) => {
                        console.log("New stat data created");
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    data[0].compressedDataKiloBytes += compressedDataBytes;
                    data[0].actualDataKiloBytes += actualDataBytes;
                    data[0].numberOfRequests += 1;
                    // data[0].statUpdatedAt = Date.now();
                    data[0].save().then((data) => {
                        console.log("Stat data updated");
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
            // Current Date Time in UTC
            let currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(currentDateTime);
        }
    }).catch(function(error){
        if (error.response === undefined) {
            console.log(error);
            res.status(400).send({"message": "Bad Request"});
            // Current Date Time in UTC
            let currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(currentDateTime);
        } else {

            console.log(error.response.data);
            res.status(400).send(error.response.data);
            // Current Date Time in UTC
            let currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(currentDateTime);
        }
    });

};

const getUserDetails = async (req, res,next) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);

    if (!authorization) {
        res.status(401).send("Unauthorized");
    }
    await axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_USER_PROFILE"]}?Id=${userId}&val=0&val1=0&val2=0&val3=0`,{
        "headers": headers.header_with_token(userId, orgId, authorization),
    }).then(function(response){
        delete response.data.normalSubjectsList;
        delete response.data.stuSubjectList;
        res.send(response.data);
        // Current Date Time in UTC
        let currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(currentDateTime);
    }).catch(function(error){
        console.log(error.response.data);
        res.status(400).send(error.response.data);
    });
}

const getPDPAttendance = async (req, res) => {
    const authorization = req.headers.authorization;
    const userId = parseInt(req.headers["x-userid"]);
    const orgId = parseInt(req.headers["x-contextid"]);
    const admissionNumber = req.query.admissionNumber;
    if (!authorization) {
        res.status(401).send("Unauthorized");
    }
    // console.log(token);
    await axios.get(`${dotEnvConfig.parsed["API_URL"]}${dotEnvConfig.parsed["ROUTE_PREFIX"]}${dotEnvConfig.parsed["ROUTE_PDP"]}?admissionNumber=${admissionNumber}&type=7`,{
        "headers": headers.header_with_token(userId, orgId, authorization),
    }).then(function(response){
        // removeNullKeys(response.data);
        response.data.forEach(element => {
            delete element.transportVehicleId;
            delete element.isOutAbsent;
            delete element.userTransportStopId;
            delete element.studentName;
            delete element.rollNumber;
            delete element.presentDays;
            delete element.totalDays;
            delete element.percentage;
            delete element.forAllExit;
            delete element.markedBy;
            delete element.dateTimeStampIns;
            delete element.isDeleted;
            delete element.batchId;
            delete element.admissionNumber;
            delete element.organizationId;
            delete element.attendanceMode;
            delete element.masterId1;
            delete element.userId;
        });
        console.log("Sending data");
        res.send(response.data);
        // Current Date Time in UTC
        let currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(currentDateTime);
    }).catch(function(error){
        console.log(error.response);
        res.status(400).send(error.response);
    });
}

const getTodayCount = (req, res) => {
    if (date.getDate() !== new Date().getDate()) {
        newUserCount = 0;
        dailyCount = 0;
        dailyUserArray.length = 0;
        date = new Date();
    }
    console.log(date.getDate());
    res.send({"dailyCount": dailyCount});
}

const getNewUserCount = (req, res) => {
    if (date.getDate() !== new Date().getDate()) {
        newUserCount = 0;
        dailyCount = 0;
        dailyUserArray.length = 0;
        date = new Date();
    }
    res.send({"newUserCount": newUserCount});
}


module.exports = {getAttendance,getUserDetails, getPDPAttendance, getTodayCount, getNewUserCount};