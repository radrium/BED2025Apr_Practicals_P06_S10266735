const bookModel = require("../models/bookModel");

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving books" });
  }
}

// Get book by ID
async function getBookById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const book = await bookModel.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving book" });
  }
}

// Create new book
async function createBook(req, res) {
  try {
    const newBook = await bookModel.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating book" });
  }
}

//Update book
async function updateBook(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const updatedBook = await bookModel.updateBook(id, req.body);
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating book" });
  }
}

// Delete book
async function deleteBook(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const rowsDeleted = await bookModel.deleteBook(id);
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting book" });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};