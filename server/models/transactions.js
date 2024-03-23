require("dotenv").config()

class Transactions {
    constructor(transactionID, userID, amount, categoryID) {
        this.transactionID = transactionID;
        this.userID = userID;
        this.amount = amount;
        this.categoryID = categoryID;
    }
}

export default Transactions;
