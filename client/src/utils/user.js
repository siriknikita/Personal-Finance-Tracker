import { sendPostData } from "../services/dataProcessing";

export const updateUser = async (data) => {
  const { email, newUsername, newPassword, currentNewPassword } = data;
  console.log(data);

  if (newPassword && currentNewPassword && (newPassword !== currentNewPassword)) {
    console.log("Passwords do not match")
    return "Passwords do not match";
  }

  if (!newUsername) {
    console.log("No username provided");
    return "No username provided";
  }

  if (newUsername && !newPassword && !currentNewPassword) {
    console.log("Updating username");
    return await sendPostData(
      "user/update/username",
      {
        email,
        newUsername,
      },
      "message"
    );
  }

  if (newPassword && currentNewPassword) {
    return await sendPostData(
      "user/update/password",
      {
        email,
        newPassword,
      },
      "message"
    );
  }

  return "Something went wrong";
};
