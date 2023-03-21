// Import necessary modules
const path = require("path"); // Module for working with file paths
const express = require("express"); // Framework for building web applications
const bodyParser = require("body-parser"); // Middleware for parsing request bodies

// Create new Express.js app
const app = express();

// Configure Cross-Origin Resource Sharing (CORS) middleware to restrict API access
const cors = require("cors");
app.use(
  cors({
    origin: "https://go.glideapps.com",
  })
);

// Import custom modules
const { upcLookup } = require("./upc"); // Module for looking up product information by UPC code
const spoonacular = require("./spoonacular"); // Module for querying the Spoonacular API for recipe and ingredient data

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static("./public"));

// Define route for serving the HTML file at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Define route for the UPC code lookup API
app.get("/api/upc", (req, res) => {
  // Call upcLookup function with the UPC code from the request query and send response
  upcLookup(req.query.code).then((data) => {
    res.send(data);
  });
});

// Define route for the recipe search API
app.get("/api/findRecepies", (req, res) => {
  console.log(spoonacular);
  // Call the Spoonacular API to search for recipes and send response
  spoonacular.recepies.find(req.query).then((data) => {
    res.send(data);
  });
});

// Define route for the ingredient classification API
app.post("/api/classifyIngredient", (req, res) => {
  console.log(req.body);
  // Call the Spoonacular API to classify the image and send response
  spoonacular.ingredients.classifyImage(req.body.image).then((data) => {
    res.send(data);
  });
});

// Start the server and log a message to the console
app.listen(5000, () => {
  console.log("Server is running on port 5000.");
  console.log("URL: http://localhost:5000/");
});
