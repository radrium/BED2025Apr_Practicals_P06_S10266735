const express = require("express");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

app.use(express.json()); // middleware inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.urlencoded()); // middleware inbuilt in express to recognize the incoming Request Object as strings or arrays

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});

// --- GET Routes  ---

// GET all books
app.get("/books", async (req, res) => {
    let connection; // Declare connection outside try for finally block
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `SELECT id, title, author FROM Books`; // Select specific columns
      const request = connection.request();
      const result = await request.query(sqlQuery);
      res.json(result.recordset); // Send the result as JSON
    } catch (error) {
      console.error("Error in GET /books:", error);
      res.status(500).send("Error retrieving books"); // Send a 500 error on failure
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
  });
  
  // GET book by ID
  app.get("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
      return res.status(400).send("Invalid book ID");
    }
  
    let connection;
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `SELECT id, title, author FROM Books WHERE id = @id`;
      const request = connection.request();
      request.input("id", bookId); // Bind the id parameter
      const result = await request.query(sqlQuery);
  
      if (!result.recordset[0]) {
        return res.status(404).send("Book not found");
      }
      res.json(result.recordset[0]); // Send the book data as JSON
    } catch (error) {
      console.error(`Error in GET /books/${bookId}:`, error);
      res.status(500).send("Error retrieving book");
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
  });

// --- POST Route  ---

// POST create new book
app.post("/books", async (req, res) => {
    const newBookData = req.body; // Get new book data from request body
  
    // **WARNING:** No validation is performed here. Invalid data may cause database errors. We will implement the necessary validation in future practicals.
  
    let connection;
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;`;
      const request = connection.request();
      // Bind parameters from the request body
      request.input("title", newBookData.title);
      request.input("author", newBookData.author);
      const result = await request.query(sqlQuery);
  
      // Attempt to fetch the newly created book to return it
      const newBookId = result.recordset[0].id;
  
      // Directly fetch the new book here instead of calling a function
      // Re-using the same connection before closing it in finally
      const getNewBookQuery = `SELECT id, title, author FROM Books WHERE id = @id`;
      const getNewBookRequest = connection.request();
      getNewBookRequest.input("id", newBookId);
      const newBookResult = await getNewBookRequest.query(getNewBookQuery);
  
      res.status(201).json(newBookResult.recordset[0]); // Send 201 Created status and the new book data
    } catch (error) {
      console.error("Error in POST /books:", error);
      // Database errors due to invalid data (e.g., missing required fields) will likely be caught here
      res.status(500).send("Error creating book");
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
});

// --- PUT Route  ---

// PUT update book by ID
app.put("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id); // Get the book ID from the URL parameters
    const updatedBookData = req.body; // Get the updated book data from the request body
  
    if (isNaN(bookId)) {
      return res.status(400).send("Invalid book ID"); // Return 400 if the ID is not a number
    }
  
    let connection;
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `UPDATE Books SET title = @title, author = @author WHERE id = @id`;
      const request = connection.request();
      // Bind parameters from the request body and URL parameter
      request.input("title", updatedBookData.title);
      request.input("author", updatedBookData.author);
      request.input("id", bookId); // Bind the id parameter
  
      const result = await request.query(sqlQuery);
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).send("Book not found"); // Return 404 if no rows were affected (book not found)
      }
      // Attempt to fetch the updated book to return it
      const getUpdatedBookQuery = `SELECT id, title, author FROM Books WHERE id = @id`;
      const getUpdatedBookRequest = connection.request();
      getUpdatedBookRequest.input("id", bookId); // Bind the id parameter
      const updatedBookResult = await getUpdatedBookRequest.query(getUpdatedBookQuery);

      // Send the updated book data as JSON
      res.status(200).json(updatedBookResult.recordset[0]); // Send 200 OK status and the updated book data
    } catch (error) {
      console.error(`Error in PUT /books/${bookId}:`, error);
      res.status(500).send("Error updating book"); // Return 500 on error
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
});

// --- DELETE Route  ---
// DELETE book by ID
app.delete("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id); // Get the book ID from the URL parameters
  
    if (isNaN(bookId)) {
      return res.status(400).send("Invalid book ID"); // Return 400 if the ID is not a number
    }
  
    let connection;
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `DELETE FROM Books WHERE id = @id`;
      const request = connection.request();
      request.input("id", bookId); // Bind the id parameter
  
      const result = await request.query(sqlQuery);
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).send("Book not found"); // Return 404 if no rows were affected (book not found)
      }
      res.status(204).send(); // Send 204 No Content status on successful deletion
    } catch (error) {
      console.error(`Error in DELETE /books/${bookId}:`, error);
      res.status(500).send("Error deleting book"); // Return 500 on error
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
});