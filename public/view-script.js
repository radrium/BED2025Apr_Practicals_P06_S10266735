const apiBaseUrl = "http://localhost:3000";
const bookDetailsDiv = document.getElementById("bookDetails");
const messageDiv = document.getElementById("message");

function getBookIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
// Function to fetch book details by ID
async function fetchBookById(bookId) {
  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);
    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }
    const book = await response.json();
    displayBookDetails(book);
  } catch (error) {
    console.error("Error fetching book details:", error);
    messageDiv.textContent = `Failed to load book details: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

// Function to display book details
function displayBookDetails(book) {
  bookDetailsDiv.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>ID:</strong> ${book.id}</p>
  `;
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  const bookId = getBookIdFromURL();
  if (bookId) {
    fetchBookById(bookId);
  } else {
    bookDetailsDiv.textContent = "No book ID specified in the URL.";
  }
});
