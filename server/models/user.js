require("dotenv").config()

class User {
    constructor(userID, username, email, passwordHash, totalSpent, weeklySpnet) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.totalSpent = totalSpent;
        this.weeklySpnet = weeklySpnet;
    }
}

export default User;
