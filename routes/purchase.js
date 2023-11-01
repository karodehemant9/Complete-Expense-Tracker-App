const express = require('express');
const purchaseController = require('../controllers/purchase');
const authenticateUser = require('../middleware/auth');
const router = express.Router();


router.get('/premiummembership', authenticateUser, purchaseController.purchasePremium);
router.post('/updatetransactionstatus', authenticateUser, purchaseController.updateTransactionStatus);



module.exports = router;
