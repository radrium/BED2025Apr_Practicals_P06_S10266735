const studentModel = require('../models/studentModel');

// Get all students
async function getAllStudents(req, res) {
    try {
        const students = await studentModel.getAllStudents();
        res.json(students);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error retrieving students" });
    }
}

// Get student by ID
async function getStudentById(req, res) {
    try {
        const studentId = parseInt(req.params.id);
        if (isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const student = await studentModel.getStudentById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error retrieving student" });
    }
}
// Create new student
async function createStudent(req, res) {
    try {
        const newStudent = await studentModel.createStudent(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error creating student" });
    }
}
// Update student
async function updateStudent(req, res) {
    try {
        const studentId = parseInt(req.params.id);
        if (isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const updatedStudent = await studentModel.updateStudent(studentId, req.body);
        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(updatedStudent);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error updating student" });
    }
}
// Delete student
async function deleteStudent(req, res) {
    try {
        const studentId = parseInt(req.params.id);
        if (isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const deletedStudent = await studentModel.deleteStudent(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(deletedStudent);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error deleting student" });
    }
}

// Export the controller functions
module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};