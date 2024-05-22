const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Category;
