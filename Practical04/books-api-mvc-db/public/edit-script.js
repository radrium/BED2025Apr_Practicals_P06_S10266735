// Get references to the elements
const editBookForm = document.getElementById("editBookForm");
const loadingMessageDiv = document.getElementById("loadingMessage"); // Element to show loading state
const messageDiv = document.getElementById("message"); // Element to display messages (success/error)
const bookIdInput = document.getElementById("bookId"); // Hidden input to store the book ID
const editTitleInput = document.getElementById("editTitle"); // Input for the book title
const editAuthorInput = document.getElementById("editAuthor"); // Input for the book author

// Base URL for the API.
const apiBaseUrl = "http://localhost:3000";

// Function to get book ID from URL query parameter (e.g., edit.html?id=1)
function getBookIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Get URL query parameters
  return params.get("id"); // Return the value of the 'id' parameter
}

// Function to fetch existing book data from the API based on ID
async function fetchBookData(bookId) {
  try {
    // Make a GET request to the API endpoint for a specific book
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);

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
    const book = await response.json();
    return book; // Return the fetched book object
  } catch (error) {
    // Catch any errors during the fetch or processing
    console.error("Error fetching book data:", error);
    // Display an error message to the user
    messageDiv.textContent = `Failed to load book data: ${error.message}`;
    messageDiv.style.color = "red";
    loadingMessageDiv.textContent = ""; // Hide loading message if it was shown
    return null; // Indicate that fetching failed
  }
}

// Function to populate the form fields with the fetched book data
function populateForm(book) {
  bookIdInput.value = book.id; // Store the book ID in the hidden input
  editTitleInput.value = book.title; // Set the title input value
  editAuthorInput.value = book.author; // Set the author input value
  loadingMessageDiv.style.display = "none"; // Hide the loading message
  editBookForm.style.display = "block"; // Show the edit form
}

// --- Code to run when the page loads ---

// Get the book ID from the URL when the page loads
const bookIdToEdit = getBookIdFromUrl();

// Check if a book ID was found in the URL
if (bookIdToEdit) {
  // If an ID exists, fetch the book data and then populate the form
  fetchBookData(bookIdToEdit).then((book) => {
    if (book) {
      // If book data was successfully fetched, populate the form
      populateForm(book);
    } else {
      // Handle the case where fetchBookData returned null (book not found or error)
      loadingMessageDiv.textContent = "Book not found or failed to load.";
      messageDiv.textContent = "Could not find the book to edit.";
      messageDiv.style.color = "red";
    }
  });
} else {
  // Handle the case where no book ID was provided in the URL
  loadingMessageDiv.textContent = "No book ID specified for editing.";
  messageDiv.textContent =
    "Please provide a book ID in the URL (e.g., edit.html?id=1).";
  messageDiv.style.color = "orange";
}

// --- Start of code for learners to complete (Form Submission / PUT Request) ---

// Add an event listener for the form submission (for the Update operation)
editBookForm.addEventListener("submit", async (event) => {
    console.log("Form submitted");
    event.preventDefault(); // Prevent the default browser form submission
    // Update details of the book
        const bookId = bookIdInput.value; // Get the book ID from the hidden input
        const updatedBookData = {
        title: editTitleInput.value, // Get the updated title from the input
        author: editAuthorInput.value, // Get the updated author from the input
    };
    // Call the function to update the book with the new data
    await updateBook(bookId, updatedBookData); // Call the function to update the book
    console.log("Book ID:", bookId);
    console.log("Updated Book Data:", updatedBookData);
    window.location.href = "index.html"; // Redirect to the main page after updating
});
// Make a PUT request to the API endpoint to update the book
async function updateBook(bookId, updatedBookData) {
    try {
        const response = await fetch(`${apiBaseUrl}/books/${bookId}`, {
            method: "PUT", // Specify the HTTP method
            headers: {
                "Content-Type": "application/json", // Tell the API we are sending JSON
            },
            body: JSON.stringify(updatedBookData), // Send the updated data as a JSON string in the request body
        });

        // Check for API response status (e.g., 200 OK, 400 Bad Request, 500 Internal Server Error)
        const responseBody = response.headers
            .get("content-type")
            ?.includes("application/json")
            ? await response.json()
            : { message: response.statusText };

        if (response.status === 200) {
            messageDiv.textContent = `Book updated successfully! ID: ${responseBody.id}`;
            messageDiv.style.color = "green";
            editBookForm.reset(); // Clear the form after success
            console.log("Updated Book:", responseBody);
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
        console.error("Error updating book:", error);
        messageDiv.textContent = `Failed to update book: ${error.message}`;
        messageDiv.style.color = "red";
    }
}
// --- End of code for learners to complete ---