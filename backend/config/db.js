const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("mail_db", "root", "Fanendra@8842", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
