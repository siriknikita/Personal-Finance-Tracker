const sequelize = require('../database');
const User = require('./User');
const Transaction = require('./Transaction');
const Category = require('./Category');
const Goal = require('./Goal');

User.hasMany(Transaction, { foreignKey: 'userID' });
Transaction.belongsTo(User, { foreignKey: 'userID' });

Category.hasMany(Transaction, { foreignKey: 'categoryID' });
Transaction.belongsTo(Category, { foreignKey: 'categoryID' });

User.hasMany(Goal, { foreignKey: 'userID' });
Goal.belongsTo(User, { foreignKey: 'userID' });

module.exports = {
    sequelize,
    User,
    Transaction,
    Category,
    Goal
};
