const express = require('express');
const router = express.Router();
const assignmentController = require('../../controllers/v1/assignment_controller');

router.get('/' , assignmentController.getAssignments);
router.post('/' , assignmentController.postAssignment);

module.exports = router;