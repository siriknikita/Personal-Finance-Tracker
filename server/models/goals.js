require("dotenv").config()

class Goals {
    constructor(userID, goalDescription, deadline) {
        this.userID = userID;
        this.goalDescription = goalDescription;
        this.deadline;
    }
}

export default Goals;
