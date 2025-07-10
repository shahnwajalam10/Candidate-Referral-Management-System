const validator = require("validator")

const validateEmail = (email) => {
  return validator.isEmail(email)
}

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, "any")
}

const sanitizeInput = (input) => {
  return validator.escape(input.trim())
}

module.exports = {
  validateEmail,
  validatePhone,
  sanitizeInput,
}
