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
    origin: "*", //"https://go.glideapps.com",
  })
);

// Import custom modules
const { upcLookup } = require("./upc"); // Module for looking up product information by UPC code
const spoonacular = require("./spoonacular"); // Module for querying the Spoonacular API for recipe and ingredient data
const cloudmersive = require("./cloudmersive");

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
  // upcLookup(req.query.code).then((data) => {
  //   res.send(data);
  // });
  spoonacular.ingredients.getUpcInfo(req.query.code).then((data) => {
    res.send(data);
  });
});

// Define route for the recipe search API
app.get("/api/findRecipes", (req, res) => {
  console.log(req.query);
  // Call the Spoonacular API to search for recipes and send response

  // res.send(
  //   // "test delayed server response"
  //   {
  //     results: [
  //       {
  //         id: 782585,
  //         title: "Cannellini Bean and Asparagus Salad with Mushrooms",
  //         image: "https://spoonacular.com/recipeImages/782585-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 716426,
  //         title: "Cauliflower, Brown Rice, and Vegetable Fried Rice",
  //         image: "https://spoonacular.com/recipeImages/716426-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 715497,
  //         title: "Berry Banana Breakfast Smoothie",
  //         image: "https://spoonacular.com/recipeImages/715497-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 715415,
  //         title: "Red Lentil Soup with Chicken and Turnips",
  //         image: "https://spoonacular.com/recipeImages/715415-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 716406,
  //         title: "Asparagus and Pea Soup: Real Convenience Food",
  //         image: "https://spoonacular.com/recipeImages/716406-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 644387,
  //         title: "Garlicky Kale",
  //         image: "https://spoonacular.com/recipeImages/644387-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 715446,
  //         title: "Slow Cooker Beef Stew",
  //         image: "https://spoonacular.com/recipeImages/715446-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 782601,
  //         title: "Red Kidney Bean Jambalaya",
  //         image: "https://spoonacular.com/recipeImages/782601-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 795751,
  //         title: "Chicken Fajita Stuffed Bell Pepper",
  //         image: "https://spoonacular.com/recipeImages/795751-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //       {
  //         id: 766453,
  //         title: "Hummus and Za'atar",
  //         image: "https://spoonacular.com/recipeImages/766453-312x231.jpg",
  //         imageType: "jpg",
  //       },
  //     ],
  //     offset: 0,
  //     number: 10,
  //     totalResults: 5221,
  //   }
  // );

  spoonacular.recepies.find(req.query).then((data) => {
    res.send(data);
  });
  console.log("sent recepies!");
});

app.get("/api/getInfo", (req, res) => {
  console.log(req.query.id);
  // Call the Spoonacular API to search for recipes and send response

  spoonacular.recepies.getInfo(req.query.id).then((data) => {
    res.send(data);
  });
  console.log("sent info!");
});

// Define route for the ingredient classification API
app.post("/api/classifyIngredient", (req, res) => {
  console.log(req.body.url);
  // Call the Spoonacular API to classify the image and send response
  spoonacular.ingredients.classifyImage(req.body.url).then((data) => {
    res.send(data);
  });
});

app.post("/api/scanBarcode", (req, res) => {
  console.log(req.body.url);
  // scanBarcode(req.body.url).then((data) => {
  //   res.send(data);
  // });
  cloudmersive.imageBufferFromURL(req.body.url).then((buffer) => {
    return cloudmersive.scanBarcode(buffer).then((data) => res.send(data));
  });
  console.log("scanned barcode");
});

app.post("/api/test", (req, res) => {
  console.log(req);
  res.send("response from server");
});

// Start the server and log a message to the console
app.listen(5000, () => {
  console.log("Server is running on port 5000.");
  console.log("URL: http://localhost:5000/");
});

{
  // cloudmersive
  //   .imageBufferFromURL(
  //     "https://cdn.discordapp.com/attachments/960862324913225758/1092194030168834239/07342052440.png"
  //   )
  //   .then((buffer) => {
  //     cloudmersive.scanBarcode(buffer).then((res) => console.log(res.RawText));
  //   });
  // new Promise((res, rej) =>
  //   setTimeout(() => {
  //     res({
  //       Successful: true,
  //       BarcodeType: "UPC_A",
  //       RawText: "073420524401",
  //     });
  //   }, 1000)
  // ).then((res) => {
  //   if (res.Successful) {
  //     // upcLookup(res.RawText).then((data) => {
  //     //   console.log(data);
  //     // });
  //     spoonacular.ingredients.getUpcInfo(res.RawText).then((data) => {
  //       console.log(data);
  //     });
  //   } else {
  //     console.error("Unsuccessful barcode scan");
  //   }
  // });
}
