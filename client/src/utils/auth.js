function extractPasswordFromEmail(email) {
  const isIncludesPassword = email.includes("@") && email.includes(".");
  if (!isIncludesPassword) {
    return "";
  }
  return email.split("@")[1].split(".")[0];
}

function extractUsernameFromEmail(email) {
  return email.split("@")[0];
}

module.exports = {
  extractPasswordFromEmail,
  extractUsernameFromEmail,
};
