const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");
// const cors = require("cors");
// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookController");
const userController = require("./controllers/userController");
const {
  validateBook,
  validateBookId,
} = require("./middlewares/bookValidation"); // import Book Validation Middleware
const {
  validateUser,
  validateUserId,
} = require("./middlewares/userValidation"); // import User Validation Middleware

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
// app.use(cors());

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// --- Serve static files from the 'public' directory ---
// When a request comes in for a static file (like /index.html, /styles.css, /script.js),
// Express will look for it in the 'public' folder relative to the project root.
app.use(express.static(path.join(__dirname, "public")));

// --- Add other general middleware here (e.g., logging, security headers) ---
// Routes for books
// Apply middleware *before* the controller function for routes that need it
app.get("/books", bookController.getAllBooks);
app.get("/books/:id", validateBookId, bookController.getBookById); // Use validateBookId middleware
app.post("/books", validateBook, bookController.createBook); // Use validateBook middleware
app.put("/books/:id", validateBookId, validateBook, bookController.updateBook); // Use validateBookId and validateBook middleware
app.delete("/books/:id", validateBookId, bookController.deleteBook); // Use validateBookId middleware
// Routes for users
app.get("/users", userController.getAllUsers);
app.get("/users/search", userController.searchUsers); // Search users by username or email
app.get("/users/with-books", userController.getUsersWithBooks); // Get users with their books
app.get("/users/:id", validateUserId, userController.getUserById); // Use validateUserId middleware
app.post("/users", validateUser, userController.createUser); // Use validateUser middleware
app.put("/users/:id", validateUserId, validateUser, userController.updateUser); // Use validateUserId and validateUser middleware
app.delete("/users/:id", validateUserId, userController.deleteUser); // Use validateUserId middleware

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});