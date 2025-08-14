const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for Swagger spec
const routes = ["./app.js"]; // Your Express route files

const doc = {
  info: {
    title: "My API",
    description: "Description of your API",
  },
  host: "localhost:3000", // Replace with your actual host if needed
  schemes: ["http"],
};

swaggerAutogen(outputFile, routes, doc);
