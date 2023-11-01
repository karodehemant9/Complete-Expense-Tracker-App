const express = require('express');
const recoverPasswordController = require('../controllers/recoverPassword');
const router = express.Router();


router.get('/resetpassword/:uuid', recoverPasswordController.resetPassword);
router.post('/forgetpassword', recoverPasswordController.forgotPassword);
router.post('/updatepassword', recoverPasswordController.updatePassword);


module.exports = router;
