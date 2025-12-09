import validator from "validator";

// Password must be 8–16 chars, 1 uppercase, 1 special character
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

export function validateSignup(req, res, next) {
  const { name, email, address, password } = req.body;

  // NAME VALIDATION
  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters."
    });
  }

  // ADDRESS VALIDATION
  if (address && address.length > 400) {
    return res.status(400).json({
      message: "Address cannot exceed 400 characters."
    });
  }

  // EMAIL VALIDATION USING validator
  if (!validator.isEmail(email || "")) {
    return res.status(400).json({
      message: "Invalid email format."
    });
  }

  // PASSWORD VALIDATION
  if (!passwordRegex.test(password || "")) {
    return res.status(400).json({
      message:
        "Password must be 8–16 chars with at least one uppercase letter and one special character."
    });
  }

  next();
}

export function validatePasswordOnly(req, res, next) {
  const { newPassword } = req.body;

  // PASSWORD VALIDATION
  if (!passwordRegex.test(newPassword || "")) {
    return res.status(400).json({
      message:
        "New password must be 8–16 chars with at least one uppercase letter and one special character."
    });
  }

  next();
}
