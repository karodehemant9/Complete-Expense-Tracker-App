const express = require('express');
const fileController = require('../controllers/file');
const authenticateUser = require('../middleware/auth');
const router = express.Router();


router.get('/get-downloadable-expense-files', authenticateUser, fileController.getDownloadableExpenseFiles);
router.delete('/delete-file/:fileID', authenticateUser, fileController.deleteExpenseFile);


module.exports = router;
