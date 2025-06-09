const Joi = require("joi");

//Validation schema for user
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 30 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
});

// Middleware to validate user data (for POST/PUT)
function validateUser(req, res, next) {
  // Validate the request body against the userSchema
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // If validation fails, format the error messages and send a 400 response
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

// Middleware to validate user ID from URL parameters (for GET by ID, PUT, DELETE)
function validateUserId(req, res, next) {
  // Parse the ID from request parameters
  const id = parseInt(req.params.id);

  // Check if the parsed ID is a valid positive number
  if (isNaN(id) || id <= 0) {
    // If not valid, send a 400 response
    return res.status(400).json({ error: "Invalid user ID. ID must be a positive number" });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

module.exports = {
  validateUser,
  validateUserId,
};
