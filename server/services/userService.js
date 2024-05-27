const { User } = require("../models");
const moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcryptjs");

async function getUser(email) {
  try {
    const isAdmin = email === process.env.ADMIN_EMAIL;
    return await User.findOne({ where: { email: email, isAdmin: isAdmin } });
  } catch (error) {
    console.error("[GET USER] Error: " + error);
  }
}

async function getUserByID(userID) {
  try {
    return await User.findOne({ where: { userID: userID } });
  } catch (error) {
    console.error("[GET USER BY ID] Error: " + error);
  }
}

async function getUsers() {
  try {
    return await User.findAll();
  } catch (error) {
    console.error("[GET USERS] Error: " + error);
  }
}


async function createUser(username, email, password, isGoogle = false) {
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
    console.error("[CREATE USER] Error: " + error);
  }
}

async function loginUser(email, password, isGoogle = false) {
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
    console.error("[LOGIN USER] Error: " + error);
  }
}


async function updateTotalSpent(userID, amount) {
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
    console.error("[UPDATE TOTAL SPENT] Error: " + error);
  }
}

async function updateEmail(currentEmail, newEmail) {
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
    console.error("[UPDATE EMAIL] Error: " + error);
  }
}

async function updatePassword(email, newPassword) {
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
    console.error("[UPDATE PASSWORD] Error: " + error);
  }
}

async function updateUsername(email, currentUsername, newUsername) {
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
    console.error("[UPDATE USERNAME] Error: " + error);
  }
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  loginUser,
  updateTotalSpent,
  updateEmail,
  updatePassword,
  updateUsername,
};
