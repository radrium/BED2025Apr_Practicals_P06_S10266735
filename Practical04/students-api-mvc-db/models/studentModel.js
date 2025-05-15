const sql = require('mssql');
const dbConfig = require('../dbConfig');

//Get all students
async function getAllStudents() {
    let connection; // Declare connection outside try for finally block
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `SELECT student_id, name, address FROM Students`; // Select specific columns
        const request = connection.request();
        const result = await request.query(sqlQuery);
        return result.recordset; // Return the result
    } catch (error) {
        console.error("Database error:", error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        if (connection) {
            try {
                await connection.close(); // Close the database connection
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
}

//Get student by ID
async function getStudentById(studentId) {
    let connection; // Declare connection outside try for finally block
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @studentId`; // Select specific columns
        const request = connection.request();
        request.input("studentId", sql.Int, studentId); // Use parameterized query to prevent SQL injection
        const result = await request.query(sqlQuery);
        if (result.recordset.length === 0) {
            return null; // Student not found
        }
        return result.recordset[0]; // Return the result
    } catch (error) {
        console.error("Database error:", error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        if (connection) {
            try {
                await connection.close(); // Close the database connection
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
}
// --- POST Route  ---
// POST a new student
async function createStudent(studentData) {
    let connection; // Declare connection outside try for finally block
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `INSERT INTO Students (name, address) OUTPUT INSERTED.student_id, INSERTED.name, INSERTED.address VALUES (@name, @address)`; // Insert a new student and return the inserted data
        const request = connection.request();
        request.input("name", sql.NVarChar, studentData.name); // Use parameterized query to prevent SQL injection
        request.input("address", sql.NVarChar, studentData.address);
        const result = await request.query(sqlQuery);
        return result.recordset[0]; // Return the result
    } catch (error) {
        console.error("Database error:", error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        if (connection) {
            try {
                await connection.close(); // Close the database connection
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
}
// --- PUT Route  ---
// Update student by ID
async function updateStudent(studentId, studentData) {
    let connection; // Declare connection outside try for finally block
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `UPDATE Students SET name = @name, address = @address WHERE student_id = @studentId`; // Update the student data
        const request = connection.request();
        request.input("studentId", sql.Int, studentId); // Use parameterized query to prevent SQL injection
        request.input("name", sql.NVarChar, studentData.name);
        request.input("address", sql.NVarChar, studentData.address);
        const result = await request.query(sqlQuery);
        if (result.rowsAffected[0] === 0) {
            return null; // Student not found
        }
        return { student_id: studentId, ...studentData }; // Return the updated data
    } catch (error) {
        console.error("Database error:", error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        if (connection) {
            try {
                await connection.close(); // Close the database connection
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
}

// --- DELETE Route  ---
// Delete student by ID
async function deleteStudent(studentId) {
    let connection; // Declare connection outside try for finally block
    try {
        connection = await sql.connect(dbConfig); // Get the database connection
        const sqlQuery = `DELETE FROM Students WHERE student_id = @studentId`; // Delete the student
        const request = connection.request();
        request.input("studentId", sql.Int, studentId); // Use parameterized query to prevent SQL injection
        const result = await request.query(sqlQuery);
        if (result.rowsAffected[0] === 0) {
            return null; // Student not found
        }
        return { message: "Student deleted successfully" }; // Return success message
    } catch (error) {
        console.error("Database error:", error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        if (connection) {
            try {
                await connection.close(); // Close the database connection
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
}

// Export the app for use in other modules
module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
}
