const { User } = require("../models");
const moment = require("moment");
require("dotenv").config();

async function getUser(email) {
  try {
    const isAdmin = email === process.env.ADMIN_EMAIL;
    return await User.findOne({ where: { email: email, isAdmin: isAdmin } });
  } catch (error) {
    console.error("[GET USER] Error: " + error);
  }
}

async function getUsers() {
  try {
    return await User.findAll();
  } catch (error) {
    console.error("[GET USERS] Error: " + error);
  }
}

async function createUser(username, email, passwordHash) {
  try {
    const existingUser = await getUser(email);
    if (existingUser) {
      return "User already exists";
    }

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      registrationDate: moment().toDate(),
      isAuthorized: true,
      isAdmin: false,
    });

    return newUser;
  } catch (error) {
    console.error("[CREATE USER] Error: " + error);
  }
}

async function loginUser(email, password, isGoogle=false) {
  try {
    const userData = await getUser(email);
    if (userData && isGoogle) {
      userData.isAuthorized = true;
      await userData.save()
      return userData.dataValues;
    } else if (userData && !isGoogle && userData.passwordHash === password) {
      userData.isAuthorized = true;
      await userData.save()
      return userData.dataValues;
    } else {
      return null;
    }
  } catch (error) {
    console.error("[LOGIN USER] Error: " + error);
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
  updateEmail,
  updatePassword,
  updateUsername,
};
