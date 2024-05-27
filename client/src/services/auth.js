import { extractPasswordFromEmail } from "../utils/auth";
import { sendPostData } from "./dataProcessing";

export async function googleLoginUser(email) {
  const response = await sendPostData(`auth/login`, {
    email: email,
    passwordHash: extractPasswordFromEmail(email),
    isGoogle: true,
  }, 'user');
  return response;
}

export async function loginUser(email, passwordHash) {
  const response = await sendPostData(`auth/login`, {
    email: email,
    passwordHash: passwordHash,
    isGoogle: false,
  }, 'user');
  console.log(response);
  return response;
}

export async function registerUser(email, isGoogle=false) {
  const passwordHash = extractPasswordFromEmail(email);
  const username = passwordHash;
  const response = await sendPostData(`auth/register`, {
    username,
    email,
    passwordHash,
    isGoogle,
  }, 'user');
  return response;
}
