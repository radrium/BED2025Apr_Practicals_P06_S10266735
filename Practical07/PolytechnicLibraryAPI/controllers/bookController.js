const bookModel = require('../models/bookModel');

// Get all books
async function getAllBooks(req, res) {
    try {
        const books = await bookModel.getAllBooks();
        res.json(books);
    }
    catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error retrieving books" });
    }
}

// Update book availability
async function updateBookAvailability(req, res) {
    try {
        const bookId = parseInt(req.params.bookId);
        const { availability } = req.body;
        if (isNaN(bookId)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }
        await bookModel.updateBookAvailability(bookId, availability);
        res.status(200).json({ message: "Book availability updated successfully" });
    }
    catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error updating book availability" });
    }
}

// User registration
async function registerUser(req, res) {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await bookModel.getUserByUsername(username);
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        // Call the model function
        await bookModel.registerUser({ username, password, role });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Login
async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" })
        }
        const loggedIn = await bookModel.login(username, password);
        if (!loggedIn) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error logging in" });
    }
}

module.exports = {
    getAllBooks,
    updateBookAvailability,
    registerUser,
    login
};