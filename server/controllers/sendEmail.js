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
  const { problem_text, sender_email } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: "mono_help_center@outlook.com",
      subject: "Support Message | Monobank",
      text: problem_text,
      html:
        "<h2>Привіт! Я" +
        sender_email +
        "стикнувся з такою проблемою:</h2><p>" +
        problem_text +
        "</p><h3>Розраховую на вашу допомогу =)</h3>",
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

async function sendSuccessTransactionEmail(recipient_email) {
  try {
    // ANTILAB 2: MOVE SENSITIVE DATA TO ENV VARIABLES
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: recipient_email,
      subject: "Incomes email | Monobank",
      text: "",
      html: "<h2>Вітання) На ваш рахунок було надіслано кошти</h2>",
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {
  sendGreetingEmail,
  sendSupportEmail,
  sendSuccessTransactionEmail,
};
