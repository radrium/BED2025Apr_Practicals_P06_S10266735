// Get references to the form and message elements:
const createStudentForm = document.getElementById("createStudentForm");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

createStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default browser form submission

  messageDiv.textContent = ""; // Clear previous messages

  // Collect data from the form inputs
  const nameInput = document.getElementById("name");
  const addressInput = document.getElementById("address");

  const newStudentData = {
    name: nameInput.value,
    address: addressInput.value,
  };

  try {
    // Make a POST request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/students`, {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Tell the API we are sending JSON
      },
      body: JSON.stringify(newStudentData), // Send the data as a JSON string in the request body
    });

    // Check for API response status (e.g., 201 Created, 400 Bad Request, 500 Internal Server Error)
    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.status === 201) {
      messageDiv.textContent = `Student created successfully! ID: ${responseBody.student_id}`;
      messageDiv.style.color = "green";
      createStudentForm.reset(); // Clear the form after success
      console.log("Created Student:", responseBody);
    } else if (response.status === 400) {
      // Handle validation errors from the API (from Practical 04 validation middleware)
      messageDiv.textContent = `Validation Error: ${responseBody.message}`;
      messageDiv.style.color = "red";
      console.error("Validation Error:", responseBody);
    } else {
      // Handle other potential API errors (e.g., 500 from error handling middleware)
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`
      );
    }
  } catch (error) {
    console.error("Error creating student:", error);
    messageDiv.textContent = `Failed to create student: ${error.message}`;
    messageDiv.style.color = "red";
  }
});
