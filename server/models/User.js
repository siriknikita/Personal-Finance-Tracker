const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define(
  "User",
  {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalSpent: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
      defaultValue: 0,
    },
    weeklySpent: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
      defaultValue: 0,
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isAuthorized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
