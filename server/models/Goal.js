const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Goal = sequelize.define('Goal', {
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userID'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Goal;
