const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env` });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  service: "outlook",
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

async function sendGreetingEmail(recipientEmail) {
  try {
    console.log("Sending email to: ", recipientEmail);
    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: recipientEmail,
      subject: "Welcome email",
      text: "You registered successfully.",
      html: "<p>Congratulations. You have registered to Personal Finance Tracker. Hope you will use our website with satisfaction</p>",
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendFeedbackEmail(feedback, userEmail) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: process.env.SMTP_SUPPORT_EMAIL,
      subject: "Feedback Message | PFT",
      text: feedback,
      html:
        "<h2>Hey! I am " +
        userEmail +
        ". I have some feedback for you:</h2><p>" +
        feedback +
        "</p>",
    });
    console.log(
      "Feedback email has been successfully sended: %s",
      info.messageId
    );
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
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Budget Limit Exceeded",
      text: "You have exceeded your monthly limit.",
      html: `<p>Hey! You have exceeded your monthly limit by $${exceededAmount}. Your monthly limit is $${monthlyLimit}.</p>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendScreenshotEmail(feedback, userEmail, filename) {
  try {
    const { fetchImageAsBuffer } = require("../azureStorage");
    const blobUrl = await fetchImageAsBuffer(
      process.env.AZURE_STORAGE_CONTAINER_NAME,
      filename + ".jpg",
    );
    const base64Data = blobUrl.toString("base64");
    const blobBuffer = `data:image/jpeg;base64,${base64Data}`;

    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: process.env.SMTP_SUPPORT_EMAIL,
      subject: "Feedback Message | PFT",
      text: feedback,
      html:
        "<h2>Hey! I am " +
        userEmail +
        ". I have some feedback for you:</h2><p>" +
        feedback +
        "</p><p>Attached is the screenshot of the feedback</p>",
      attachments: [
        {
          filename: filename,
          path: blobBuffer,
        },
      ],
    });
    console.log(
      "Feedback email has been successfully sended: %s",
      info.messageId
    );
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {
  transporter,
  sendGreetingEmail,
  sendFeedbackEmail,
  sendBudgetLimitExceededEmail,
  sendScreenshotEmail,
};
