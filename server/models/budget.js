require("dotenv").config()

class Budget {
    constructor(userID, categoryID, amount) {
        this.userID = userID;
        this.categoryID = categoryID;
        this.amount = amount;
    }
}

export default Budget;
