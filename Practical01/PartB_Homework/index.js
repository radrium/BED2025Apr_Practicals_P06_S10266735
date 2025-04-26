const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

// Define route for About Page
app.get("/into", (req, res) => {
    res.send("I am a student at Ngee Ann Polytechnic.");
});

// Define route for Contact Page
app.get("/name", (req, res) => {
    res.send("Lee Wei Hang");
});

app.get("/hobbies", (req, res) => {
    res.send("I enjoy playing football and swimming.");
});

app.get("/food", (req, res) => {
    res.send("I love noodles and chicken.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});