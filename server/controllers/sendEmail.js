const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "outlook",
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

async function sendGreetingEmail(recipientEmail) {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: recipientEmail,
      subject: "Welcome email",
      text: "You registered successfully.",
      html: "<p>Congratulations. You have registered to Personal Finance Tracker. Hope you will use our website with satisfaction</p>",
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendSupportEmail(req, res) {
  const { issueDescription, userEmail } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: process.env.NODEMAILER_PFT_SUPPORT_EMAIL,
      subject: "Support Message | PFT",
      text: issueDescription,
      html:
        "<h2>Hey! I am" +
        userEmail +
        ". I need your help. I have the following problem:</h2><p>" +
        issueDescription +
        "</p><h3>Please, help me solve the problem.</h3>",
    });

    return res
      .status(200)
      .send({ message: "Support email has been successfully sended" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(400)
      .send({ message: "Error sending while sending support email" });
  }
}

async function sendFeedbackEmail(req, res) {
  const { feedback, userEmail } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: process.env.NODEMAILER_PFT_SUPPORT_EMAIL,
      subject: "Feedback Message | PFT",
      text: feedback,
      html:
        "<h2>Hey! I am" +
        userEmail +
        ". I have some feedback for you:</h2><p>" +
        feedback +
        "</p>",
    });

    return res
      .status(200)
      .send({ message: "Feedback email has been successfully sended" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(400)
      .send({ message: "Error sending while sending feedback email" });
  }
}

async function sendBudgetLimitExceededEmail(email) {
  const userController = require("./user.controller");
  const budgetController = require("./budget.controller");
  const userID = await userController.getUserIDByEmail(email);
  const monthlyLimit = await budgetController.getMonthlyLimitByUserID(userID);
  const totalSpent = await budgetController.getTotalSpentByUserID(userID);
  const exceededAmount = totalSpent - monthlyLimit;

  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "Budget Limit Exceeded",
      text: "You have exceeded your monthly limit.",
      html:
        `<p>Hey! You have exceeded your monthly limit by $${exceededAmount}. Your monthly limit is $${monthlyLimit}.</p>`
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {
  sendGreetingEmail,
  sendSupportEmail,
  sendFeedbackEmail,
  sendBudgetLimitExceededEmail,
};
