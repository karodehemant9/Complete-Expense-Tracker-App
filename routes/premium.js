const express = require('express');
const premiumController = require('../controllers/premium');
const authenticateUser = require('../middleware/auth');
const router = express.Router();


router.get('/show-leaderboard', authenticateUser, premiumController.getLeaderboardData);


module.exports = router;
