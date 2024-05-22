import { extractPasswordFromEmail } from "../utils/auth";
import { sendPostData } from "./dataProcessing";

export async function loginUser(email, isGoogle=false) {
  const passwordHash = extractPasswordFromEmail(email);
  const response = await sendPostData(`auth/login`, {
    email: email,
    password: passwordHash,
    isGoogle: isGoogle,
  }, 'user');
  console.log(response);
  return response;
}

export async function registerUser(email) {
  const passwordHash = extractPasswordFromEmail(email);
  const username = passwordHash;
  const response = await sendPostData(`auth/signup`, {
    username,
    email,
    passwordHash,
  }, 'user');
  return response;
}
