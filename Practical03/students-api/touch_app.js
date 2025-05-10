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
// Implement the full CRUD operations for Students, embedding the database interaction logic directly within the route handlers, following the pattern of the Books API GET /books and POST /books handlers:
// GET /students: Retrieve all students.
// GET /students/:id: Retrieve a student by their student_id.
// POST /students: Create a new student. Get the student data (name, address, etc.) from req.body. Remember to fetch the newly created student (including their generated student_id) after the insert.
// PUT /students/:id: Update an existing student by their student_id. Get the updated data from req.body. Handle the case where the student is not found (404). Fetch the updated student to return.
// DELETE /students/:id: Delete a student by their student_id. Handle the case where the student is not found (404). Return 204 on success.
// For each route handler, include a try...catch...finally block to manage database operations, basic error handling (sending 500 on database errors, 404 for not found), and ensure the database connection is closed.

// --- GET Routes  ---
// GET all students
app.get("/students", async (req, res) => {
    let connection; // Declare connection outside try for finally block
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `SELECT student_id, name, address FROM Students`; // Select specific columns
        const request = connection.request();
        const result = await request.query(sqlQuery);
        res.json(result.recordset); // Send the result as JSON
    } catch (error) {
        console.error("Error in GET /students:", error);
        res.status(500).send("Error retrieving students"); // Send a 500 error on failure
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
// GET student by ID
app.get("/students/:id", async (req, res) => {
    let connection; // Declare connection outside try for finally block
    const studentId = req.params.id; // Get the student_id from the request parameters
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @studentId`; // Select specific columns
        const request = connection.request();
        request.input("studentId", sql.Int, studentId); // Use parameterized query to prevent SQL injection
        const result = await request.query(sqlQuery);
        if (result.recordset.length === 0) {
            return res.status(404).send("Student not found"); // Send a 404 error if no student is found
        }
        res.json(result.recordset[0]); // Send the result as JSON
    } catch (error) {
        console.error("Error in GET /students/:id:", error);
        res.status(500).send("Error retrieving student"); // Send a 500 error on failure
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
// POST a new student
app.post("/students", async (req, res) => {
    let connection; // Declare connection outside try for finally block
    const { name, address } = req.body; // Get the student data from the request body
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `INSERT INTO Students (name, address) OUTPUT INSERTED.student_id, INSERTED.name, INSERTED.address VALUES (@name, @address)`; // Insert a new student and return the inserted data
        const request = connection.request();
        request.input("name", sql.NVarChar, name); // Use parameterized query to prevent SQL injection
        request.input("address", sql.NVarChar, address);
        const result = await request.query(sqlQuery);
        res.status(201).json(result.recordset[0]); // Send the created student as JSON with 201 status code
    } catch (error) {
        console.error("Error in POST /students:", error);
        res.status(500).send("Error creating student"); // Send a 500 error on failure
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
// PUT update a student
app.put("/students/:id", async (req, res) => {
    let connection; // Declare connection outside try for finally block
    const studentId = req.params.id; // Get the student_id from the request parameters
    const { name, address } = req.body; // Get the updated data from the request body
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `UPDATE Students SET name = @name, address = @address WHERE student_id = @studentId`; // Update the student data
        const request = connection.request();
        request.input("studentId", sql.Int, studentId); // Use parameterized query to prevent SQL injection
        request.input("name", sql.NVarChar, name);
        request.input("address", sql.NVarChar, address);
        const result = await request.query(sqlQuery);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).send("Student not found"); // Send a 404 error if no student is found
        }
        // Fetch the updated student data
        const updatedSqlQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @studentId`; // Select specific columns
        const updatedRequest = connection.request();
        updatedRequest.input("studentId", sql.Int, studentId); // Use parameterized query to prevent SQL injection
        const updatedBookResult = await updatedRequest.query(updatedSqlQuery);
        
        // Send the updated book data as JSON
        res.status(200).json(updatedBookResult.recordset[0]); // Send 200 OK status and the updated book data
    } catch (error) {
        console.error("Error in PUT /students/:id:", error);
        res.status(500).send("Error updating student"); // Send a 500 error on failure
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
// DELETE a student
app.delete("/students/:id", async (req, res) => {
    let connection; // Declare connection outside try for finally block
    const studentId = req.params.id; // Get the student_id from the request parameters
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `DELETE FROM Students WHERE student_id = @studentId`; // Delete the student
        const request = connection.request();
        request.input("studentId", sql.Int, studentId); // Use parameterized query to prevent SQL injection
        const result = await request.query(sqlQuery);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).send("Student not found"); // Send a 404 error if no student is found
        }
        res.status(204).send(); // Send a 204 No Content response on success
    } catch (error) {
        console.error("Error in DELETE /students/:id:", error);
        res.status(500).send("Error deleting student"); // Send a 500 error on failure
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


