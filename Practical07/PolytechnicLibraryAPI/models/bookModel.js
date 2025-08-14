const sql = require('mssql');
const dbConfig = require('../dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT book_id, title, author, availability FROM Books";
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Update book availability
async function updateBookAvailability(bookId, availability) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "UPDATE Books SET availability = @availability WHERE book_id = @book_id";
    const request = connection.request();
    request.input("book_id", sql.Int, bookId);
    request.input("availability", sql.Char(1), availability);
    await request.query(query);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// User registration
async function registerUser(userData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const query = "INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)";
    const request = connection.request();
    request.input("username", sql.VarChar(255), userData.username);
    request.input("passwordHash", sql.VarChar(255), hashedPassword);
    request.input("role", sql.VarChar(20), userData.role);
    await request.query(query);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get user by username
async function getUserByUsername(username) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM Users WHERE username = @username";
    const request = connection.request();
    request.input("username", sql.VarChar(255), username);
    const result = await request.query(query);
    return result.recordset[0]; // Return the user object or null
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

async function login(username, password) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const user = await getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    return { token };
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

module.exports = {
  getAllBooks,
  updateBookAvailability,
  registerUser,
  login,
  getUserByUsername
};