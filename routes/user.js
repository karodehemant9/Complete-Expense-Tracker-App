const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();


router.post('/signup', userController.addUser);
router.post('/login', userController.validateUser);
// router.get('/download', (req,res)=>{
//     res.redirect('/expense/download');
// });




module.exports = router;
