const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { upcLookup } = require("./upc");
const spoonacular = require("./spoonacular");

app.use(bodyParser.json());
app.use(express.static("./public"));

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/upc", (req, res) => {
  upcLookup(req.query.code).then((data) => {
    res.send(data);
  });
});

app.get("/api/findRecepies", (req, res) => {
  spoonacular.recepies.findRecepies(req.query).then((data) => {
    res.send(data);
  });
});

app.post("/api/classifyIngredient", (req, res) => {
  console.log(req.body);
  // res.send({ data: "example response" });
  spoonacular.ingredients.classifyImage(req.body.image).then((data) => {
    res.send(data);
  });
});

app.listen(5000, () => {
  console.log("Sever is running on port 5000.");
  console.log("http://localhost:5000/");
});
