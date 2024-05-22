const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Category = require('./Category');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userID'
        }
    },
    categoryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

module.exports = Transaction;
