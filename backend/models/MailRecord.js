const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MailRecord = sequelize.define("MailRecord", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.ENUM("SENT", "PENDING"), defaultValue: "PENDING" },
  opened: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = MailRecord;
