const express = require('express');
const router = express.Router();
const studentController_v2 = require('../../controllers/v2/student_controller');

router.get('/attendance', studentController_v2.getAttendance);
router.get('/user', studentController_v2.getUserDetails);
router.get('/pdp-attendance', studentController_v2.getPDPAttendance);
router.get('/today-count', studentController_v2.getTodayCount);
router.get('/new-user-count', studentController_v2.getNewUserCount);

module.exports = router;
