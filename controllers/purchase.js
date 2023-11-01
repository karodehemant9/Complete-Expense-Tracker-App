const Razorpay = require('razorpay');
const Order = require('../models/order');
const sequelize = require('../util/database');
 
require('dotenv').config();


exports.purchasePremium = (async (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });


    var options = {
      amount: 3500,  // amount in the smallest currency unit (3500 paise)
      currency: "INR"
    };


    instance.orders.create(options, async function (err, order) {
      const t = await sequelize.transaction();
      try {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        console.log(order);
        console.log('order dekh lo upar');

        const newOrder = await req.user.createOrder({ orderid: order.id, status: 'PENDING' }, { transaction: t })
        await t.commit();
        return res.status(201).json({ order, key_id: instance.key_id });

      }
      catch (err) {
        await t.rollback();
        console.log(err);
        return res.status(403).json({ message: 'Somthing went wrong', error: err });
      }
    });


  }
  catch (err) {
    return res.status(403).json({ message: 'Somthing went wrong', error: err });
  }
})


exports.updateTransactionStatus = (async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }, { transaction: t });
    await req.user.update({ isPremiumUser: true }, { transaction: t });
    await t.commit();
    return res.status(202).json({ isPremiumUser: true, success: true, message: 'Transaction successful' });
  }
  catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).json({ isPremiumUser: false, success: false, message: 'Transaction unsuccessful' });
  }
})


