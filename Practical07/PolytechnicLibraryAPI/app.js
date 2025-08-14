const sql = require('mssql');
const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require("./swagger-output.json"); // Import generated spec
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Controller
const bookController = require('./controllers/bookController');

// Middleware for authentication
const authMiddleware = require('./middlewares/authenticate');

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Book routes
app.get('/books', authMiddleware, bookController.getAllBooks);
app.put('/books/:bookId/availability', authMiddleware, bookController.updateBookAvailability);

// User routes
app.post('/register', bookController.registerUser);
app.post('/login', bookController.login);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});

process.on("SIGINT", async () => {
    console.log("Server shutting down gracefully");
    await sql.close();
    console.log("Database connections closed");
    process.exit(0);
})

