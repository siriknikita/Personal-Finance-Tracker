require("dotenv").config("../../../.env");

function validateLogin(email, password) {
	const specialSymbols = "-";
	
	if (password.length < 12 &&
		!password.includes(specialSymbols) &&
		!email.includes("@")
		) {
			return false
	} else {
		return true
	}
}

module.exports = validateLogin
