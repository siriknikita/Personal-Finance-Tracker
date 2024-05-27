const { User } = require("../models");
const moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const getUser = async (email) => {
  try {
    const isAdmin = email === process.env.ADMIN_EMAIL;
    return await User.findOne({ where: { email: email, isAdmin: isAdmin } });
  } catch (error) {
    console.log("Error in getUser controller" + error);
    throw new Error("Error in getUser controller: " + error);
  }
}

const getUserByID = async (userID) => {
  try {
    return await User.findOne({ where: { userID: userID } });
  } catch (error) {
    console.log("Error in getUserByID controller" + error);
    throw new Error("Error in getUserByID controller: " + error);
  }
}

const getUsers = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    console.log("Error in getUsers controller" + error);
    throw new Error("Error in getUsers controller: " + error);
  }
}


const createUser = async (username, email, password, isGoogle = false) => {
  try {
    const existingUser = await getUser(email);
    if (existingUser) {
      return "User already exists";
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email,
      passwordHash: isGoogle ? "": passwordHash,
      registrationDate: moment().toDate(),
      isAuthorized: true,
      isAdmin: false,
    });

    return newUser.dataValues;
  } catch (error) {
    console.log("Error in createUser controller" + error);
    throw new Error("Error in createUser controller: " + error);
  }
}

const loginUser = async (email, password, isGoogle = false) => {
  try {
    const userData = await getUser(email);
    // If the user is logging in with Google, we don't need to check the password
    if (!userData) {
      return null;
    }
    if (!isGoogle) {
      const passwordMatch = await bcrypt.compare(password, userData.dataValues.passwordHash);
      if (!passwordMatch) {
        return null;
      }
    }
    userData.isAuthorized = true;
    await userData.save();
    return userData.dataValues;
  } catch (error) {
    console.log("Error in loginUser controller" + error);
    throw new Error("Error in loginUser controller: " + error);
  }
}


const updateTotalSpent = async (userID, amount) => {
  try {
    const user = await getUserByID(userID);
    if (user) {
      user.totalSpent += amount;
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error in updateTotalSpent controller" + error);
    throw new Error("Error in updateTotalSpent controller: " + error);
  }
}

const updateEmail = async (currentEmail, newEmail) => {
  try {
    const user = await getUser(currentEmail);
    if (user) {
      user.email = newEmail;
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error in updateEmail controller" + error);
    throw new Error("Error in updateEmail controller: " + error);
  }
}

const updatePassword = async (email, newPassword) => {
  try {
    const user = await getUser(email);
    if (user) {
      user.passwordHash = newPassword;
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error in updatePassword controller" + error);
    throw new Error("Error in updatePassword controller: " + error);
  }
}

const updateUsername = async (email, currentUsername, newUsername) => {
  try {
    const user = await getUser(email);
    if (user && user.username === currentUsername) {
      user.username = newUsername;
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error in updateUsername controller" + error);
    throw new Error("Error in updateUsername controller: " + error);
  }
}

module.exports = {
  getUser,
  getUserByID,
  getUsers,
  createUser,
  loginUser,
  updateTotalSpent,
  updateEmail,
  updatePassword,
  updateUsername,
};
