const express = require('express');
const expenseController = require('../controllers/expense');
const authenticateUser = require('../middleware/auth');
const router = express.Router();


router.post('/add-expense', authenticateUser, expenseController.addExpense);
router.delete('/delete-expense/:expenseID', authenticateUser, expenseController.deleteExpense);
router.get('/download', authenticateUser, expenseController.downloadExpenses);



router.get('/get-expenses/:pageNo/:itemsPerPage', authenticateUser, expenseController.getExpenses);
router.get('/get-daily-expenses/:pageNo/:itemsPerPage', authenticateUser, expenseController.getDailyExpenses);
router.get('/get-weekly-expenses/:pageNo/:itemsPerPage', authenticateUser, expenseController.getWeeklyExpenses);
router.get('/get-monthly-expenses/:pageNo/:itemsPerPage', authenticateUser, expenseController.getMonthlyExpenses);





module.exports = router;
