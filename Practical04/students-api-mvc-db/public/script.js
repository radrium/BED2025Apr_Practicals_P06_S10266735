// Get references to the HTML elements you'll interact with:
const studentListDiv = document.getElementById("studentsList");
const fetchStudentsBtn = document.getElementById("fetchStudentsBtn");
const messageDiv = document.getElementById("message"); // Get reference to the message div
const apiBaseUrl = "http://localhost:3000";

// Function to fetch students from the API and display them
// In students.html, fetch and display all students. Include buttons/links for View (optional), Edit, and Delete.
async function fetchStudents() {
  try {
    studentListDiv.innerHTML = "Loading students..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages (assuming a message div exists or add one)

    // Make a GET request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/students`);

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      // Attempt to read error body if available, otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response
    const students = await response.json();

    // Clear previous content and display students
    studentListDiv.innerHTML = ""; // Clear loading message
    if (students.length === 0) {
      studentListDiv.innerHTML = "<p>No students found.</p>";
    } else {
      students.forEach((student) => {
        const studentElement = document.createElement("div");
        studentElement.classList.add("student-item");
        // Use data attributes or similar to store ID on the element if needed later
        studentElement.setAttribute("data-student-id", student.id);
        studentElement.innerHTML = `
                    <h3>${student.name}</h3>
                    <p>Age: ${student.address}</p>
                    <p>ID: ${student.student_id}</p>
                    <button onclick="viewStudentDetails(${student.id})">View Details</button>
                    <button onclick="editStudent(${student.id})">Edit</button>
                    <button class="delete-btn" data-id="${student.id}">Delete</button>
                `;
        studentListDiv.appendChild(studentElement);
      });
      // Add event listeners for delete buttons after they are added to the DOM
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    studentListDiv.innerHTML = `<p style="color: red;">Failed to load students: ${error.message}</p>`;
  }
}
// Function to handle delete button click
async function handleDeleteClick(event) {
  const studentId = event.target.getAttribute("data-id");
    try {
      const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }
      // Refresh the list of students after deletion
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      messageDiv.textContent = `Failed to delete student: ${error.message}`;
    }
  }
// Function to view student details (placeholder, to be implemented)
function viewStudentDetails(studentId) {
  console.log("View details for student ID:", studentId);
  window.location.href = `view.html?id=${studentId}`; // Assuming you create view.html
}

// Function to edit student (placeholder, to be implemented)
function editStudent(studentId) {
  console.log("Edit student with ID:", studentId);
  // In a real app, redirect to edit.html with the student ID
  window.location.href = `edit-student.html?id=${studentId}`; // Assuming you create edit.html
}

// Event listener for the button to fetch students
fetchStudentsBtn.addEventListener("click", fetchStudents);

// Initial fetch of students when the page loads
document.addEventListener("DOMContentLoaded", fetchStudents);