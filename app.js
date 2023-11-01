const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const sequelize = require('./util/database');



const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgetPasswordRequest = require('./models/forgetPasswordRequest');
const DownloadedFile = require('./models/downloadedFile');



const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const fileRoutes = require('./routes/file');


const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve files from the 'public' directory


app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/file', fileRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);


app.use((req, res, next) => {
  // Check if the request URL is not the desired URL.
  if (req.originalUrl !== '/login/login.html') {
    return res.redirect('http://54.91.70.145:8000/login/login.html');
  }
  // If the request URL is the desired URL, proceed to the next middleware.
  next();
});



User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPasswordRequest);
ForgetPasswordRequest.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);




sequelize
  //.sync({force: true})
  .sync()
  .then(result => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  })


