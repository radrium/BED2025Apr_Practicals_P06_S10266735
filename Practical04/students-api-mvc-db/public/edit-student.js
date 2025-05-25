// Get references to the elements
const editStudentForm = document.getElementById("editStudentForm");
const loadingMessageDiv = document.getElementById("loadingMessage"); // Element to show loading state
const messageDiv = document.getElementById("message"); // Element to display messages (success/error)
const studentIdInput = document.getElementById("studentId"); // Hidden input to store the student ID
const editNameInput = document.getElementById("editName"); // Input for the student name
const editAddressInput = document.getElementById("editAddress"); // Input for the student address

// Base URL for the API.
const apiBaseUrl = "http://localhost:3000";

// Function to get student ID from URL query parameter (e.g., edit-student.html?id=1)
function getStudentIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Get URL query parameters
  return params.get("id"); // Return the value of the 'id' parameter
}

// Function to fetch existing student data from the API based on ID
async function fetchStudentData(studentId) {
  try {
    // Make a GET request to the API endpoint for a specific student
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`);

    // Check if the HTTP response status is not OK (e.g., 404, 500)
    if (!response.ok) {
      // Attempt to read error body if available (assuming JSON), otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      // Throw an error with status and message
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response body into a JavaScript object
    const student = await response.json();
    return student; // Return the fetched student object
  } catch (error) {
    // Catch any errors during the fetch or processing
    console.error("Error fetching student data:", error);
    // Display an error message to the user
    messageDiv.textContent = `Failed to load student data: ${error.message}`;
    messageDiv.style.color = "red";
    loadingMessageDiv.textContent = ""; // Hide loading message if it was shown
    return null; // Indicate that fetching failed
  }
}

// Function to populate the form fields with the fetched student data
function populateForm(student) {
  studentIdInput.value = student.student_id; // Store the student ID in the hidden input
  editNameInput.value = student.name; // Set the name input value
  editAddressInput.value = student.address; // Set the address input value
  loadingMessageDiv.style.display = "none"; // Hide the loading message
  editStudentForm.style.display = "block"; // Show the edit form
}

// -- Code to run when the page loads --

// Get the student ID from the URL when the page loads
const studentId = getStudentIdFromUrl();

// Check if a student ID was provided
if (studentId) {
    loadingMessageDiv.textContent = "Loading student data..."; // Show loading message
    loadingMessageDiv.style.display = "block"; // Display the loading message

    // Fetch the student data from the API
    fetchStudentData(studentId).then((student) => {
        if (student) {
        populateForm(student); // Populate the form with the fetched student data
        } else {
            // Handle the case where fetchStudentData returned null (student not found or error)
            messageDiv.textContent = "Failed to load student data.";
            messageDiv.style.color = "red";
        }   
    });
}   else {
    // Handle the case where no student ID was provided in the URL
    loadingMessageDiv.textContent = "No student ID provided.";
    messageDiv.textContent = "Could not find the student to edit.";
    messageDiv.style.color = "red";
}

// Add event listener for the form submission
editStudentForm.addEventListener("submit", async (event) => {
    console.log("Edit Student Form Submitted");
    event.preventDefault(); // Prevent the default form submission
    // Update details of student
    const studentId = studentIdInput.value; // Get the student ID from the hidden input
    const updatedStudentData = {
        name: editNameInput.value,
        address: editAddressInput.value,
    };
    // Call the function to update the student data
    await updateStudent(studentId, updatedStudentData);
    console.log("Updated Student Data:", updatedStudentData);
    console.log("Student ID:", studentId);
    window.location.href = "students.html"; // Redirect to the main page after editing
});

// Make a PUT request to API endpoint to update the student data
async function updateStudent(studentId, updatedData) {
  try {
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
      method: "PUT", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Tell the API we are sending JSON
      },
      body: JSON.stringify(updatedData), // Send the updated data as a JSON string in the request body
    });

    // Check if the response status is OK (e.g., 200 OK)
    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `API error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response body
    const responseBody = await response.json();
    messageDiv.textContent = `Student updated successfully! ID: ${responseBody.student_id}`;
    messageDiv.style.color = "green";
  } catch (error) {
    console.error("Error updating student:", error);
    messageDiv.textContent = `Failed to update student: ${error.message}`;
    messageDiv.style.color = "red";
  }
}