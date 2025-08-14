const sql = require('mssql');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Controller
const bookController = require('./controllers/bookController');

// Middleware for authentication
const authMiddleware = require('./middlewares/authenticate');

// Book routes
app.get('/books', authMiddleware, bookController.getAllBooks);
app.put('/books/:bookId/availability', authMiddleware, bookController.updateBookAvailability);

// User routes
app.post('/register', bookController.registerUser);
app.post('/login', bookController.login);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server shutting down gracefully");
    await sql.close();
    console.log("Database connections closed");
    process.exit(0);
})

