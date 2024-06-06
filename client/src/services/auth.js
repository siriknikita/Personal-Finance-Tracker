import { extractPasswordFromEmail, extractUsernameFromEmail } from "../utils/auth";
import { sendPostData } from "./dataProcessing";

export async function googleLoginUser(email) {
  console.log("In googleLoginUser");
  console.log("Email:", email)
  const response = await sendPostData(
    `auth/login`,
    {
      email,
      passwordHash: extractPasswordFromEmail(email),
      isGoogle: true,
    },
    "user"
  );
  console.log("Response:", response);
  return response;
}

export async function googleRegisterUser(email) {
  const response = await sendPostData(
    `auth/register`,
    {
      username: extractUsernameFromEmail(email),
      email,
      passwordHash: extractPasswordFromEmail(email),
      isGoogle: true,
    },
    "user"
  );
  return response;
}

export async function loginUser(email, passwordHash) {
  const response = await sendPostData(
    `auth/login`,
    {
      email: email,
      passwordHash: passwordHash,
      isGoogle: false,
    },
    "user"
  );
  return response;
}

export async function registerUser(
  username,
  email,
  passwordHash = "",
  isGoogle = false
) {
  const response = await sendPostData(
    `auth/register`,
    {
      username,
      email,
      passwordHash: isGoogle ? extractPasswordFromEmail(email) : passwordHash,
      isGoogle,
    },
    "user"
  );
  return response;
}
