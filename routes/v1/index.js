const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/v1/student_controller');

router.get('/', async (req, res) => {
    res.send('Welcome to the ERP API');
});
router.get('/attendance', studentController.getAttendance);
router.get('/user', studentController.getUserDetails);
router.get('/pdp-attendance', studentController.getPDPAttendance);

module.exports = router;
