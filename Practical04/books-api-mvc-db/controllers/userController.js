const User = require('../models/userModel');

// createUser
async function createUser(req, res) {
    try {
        const newUser = await User.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
}

// getAllUsers
async function getAllUsers(req, res) {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
}

//getUserById
async function getUserById(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await User.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error retrieving user' });
    }
}

// updateUser
async function updateUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const updatedUser = await User.updateUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
}

// deleteUser
async function deleteUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const deletedUser = await User.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(deletedUser);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}

// searchUsers
async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Controller error in searchUsers:", error);
    res.status(500).json({ message: "Error searching users" });
  }
}

// getUsersWithBooks
async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error("Controller error in getUsersWithBooks:", error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersWithBooks
};