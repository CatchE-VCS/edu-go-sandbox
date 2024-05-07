const express = require('express');
const router = express.Router();
const authController = require('../../controllers/v1/auth_controller');

/* GET user logged in. */
router.post('/', authController.login);
router.post('/forget', authController.forgotPassword);

module.exports = router;