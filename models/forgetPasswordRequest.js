const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgetPasswordRequest  = sequelize.define('forgetPasswordRequest',{
  uuid: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
  userId: {type: Sequelize.INTEGER, allowNull: false},
  isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
});

module.exports = ForgetPasswordRequest; 
  