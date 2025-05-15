const joi = require("joi"); // Import Joi for validation

// Validation schema for students (used for POST/PUT)
const studentSchema = joi.object({
    name: joi.string().min(1).max(50).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 1 character long",
        "string.max": "Name cannot exceed 50 characters",
        "any.required": "Name is required",
    }),
    address: joi.string().min(1).max(100).required().messages({
        "string.base": "Address must be a string",
        "string.empty": "Address cannot be empty",
        "string.min": "Address must be at least 1 character long",
        "string.max": "Address cannot exceed 100 characters",
        "any.required": "Address is required",
    }),
});

// Middleware to validate student data (for POST/PUT)
function validateStudent(req, res, next) {
    // Validate the request body against the studentSchema
    const { error } = studentSchema.validate(req.body, { abortEarly: false }); // abortEarly: false collects all errors

    if (error) {
        // If validation fails, format the error messages and send a 400 response
        const errorMessage = error.details.map((detail) => detail.message).join(", ");
        return res.status(400).json({ error: errorMessage });
    }

    // If validation succeeds, pass control to the next middleware/route handler
    next();
}
// Middleware to validate student ID from URL parameters (for GET by ID, PUT, DELETE)
function validateStudentId(req, res, next) {
    // Parse the ID from request parameters
    const studentId = parseInt(req.params.id);

    // Check if the parsed ID is a valid positive number
    if (isNaN(studentId) || studentId <= 0) {
        // If not valid, send a 400 response
        return res.status(400).json({ error: "Invalid student ID. ID must be a positive number" });
    }

    // If validation succeeds, pass control to the next middleware/route handler
    next();
}

module.exports = {
    validateStudent,
    validateStudentId,
};