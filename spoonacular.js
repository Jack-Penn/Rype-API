const axios = require("axios").default; // import axios library to make API requests
require("dotenv").config(); // import dotenv to use environment variables
const fs = require("fs"); // import fs to read/write files

// Export the Spoonacular API methods as an object
{
  Object.assign(exports, {
    // define a Spoonacular API object and export it to be used in other files
    recepies: {
      // define an object with recipe-related functions
      find: spoonacularGet(
        "https://api.spoonacular.com/recipes/complexSearch",
        { instructionsRequired: true }
      ), // define a 'find' function to search for recipes using the Spoonacular API
      getInfo: (ids) => {
        // define a 'getInfo' function to retrieve recipe information using the Spoonacular API
        spoonacularGet("https://api.spoonacular.com/recipes/informationBulk", {
          includeNutrition: false, // set a default value for the 'includeNutrition' parameter
        })({
          ...arguments, // create a new object with the 'ids' argument and any other arguments passed to the function
          ids: Array.isArray(ids) ? ids.join(",") : ids, // if 'ids' is an array, join it into a comma-separated string; otherwise, use 'ids' as is
        });
      },
      getInstructions: getDataUrl(
        // define a 'getInstructions' function to retrieve recipe instructions using the Spoonacular API
        ["https://api.spoonacular.com/recipes/", "/analyzedInstructions"],
        { stepBreakdown: false } // set a default value for the 'stepBreakdown' parameter
      ),
    },

    ingredients: {
      // define an object with ingredient-related functions
      getSubstitute: getDataUrl([
        // define a 'getSubstitute' function to retrieve ingredient substitutes using the Spoonacular API
        "https://api.spoonacular.com/food/ingredients/",
        "/substitutes",
      ]),
      getUpcInfo: (upc) =>
        spoonacularGet(
          "https://api.spoonacular.com/food/products/upc/" + upc
        )(),
      //   getDataUrl([
      //   // define a 'getUpcInfo' function to retrieve product information using a UPC code and the Spoonacular API
      //   "https://api.spoonacular.com/food/products/upc/",
      // ]),

      classifyImage: (url) =>
        spoonacularGet("https://api.spoonacular.com/food/images/classify")({
          imageUrl: url,
        }),
    },

    products: {},
  });

  function spoonacularGet(endpoint, defaultParams = {}) {
    // define a helper function to make GET requests to the Spoonacular API
    return (params) => {
      return axios
        .get(endpoint, {
          params: {
            ...defaultParams,
            ...params, // merge any additional parameters passed to the function with the default parameters
            apiKey: process.env.SPOON_API_KEY, // pass the Spoonacular API key as a parameter
          },
        })
        .then((res) => {
          console.log(endpoint + ":"); // log the endpoint URL
          console.log(res.data); // log the API response data
          return res.data;
        });
    };
  }

  /**
   * Returns a function that gets data from a Spoonacular API endpoint
   * by constructing the URL using pieces of the endpoint URL and arguments.
   * The resulting URL is used to make a GET request.
   *
   * @param {Array} urlPieces An array containing parts of the API endpoint URL
   * @param {Object} defaultParams An object containing default parameter values
   * @returns {Function} A function that sends a GET request to the specified endpoint with the specified parameters
   */
  function getDataUrl(urlPieces, defaultParams) {
    return (...args) => {
      // Combine the URL pieces and arguments into a single URL
      const url = [urlPieces]
        .flat() // Make sure the array is one-dimensional
        .slice(1) // Remove the first element (which is an empty string)
        .reduce(
          (res, piece, i) => res + (args[i] ? args[i] : "") + piece,
          args[0]
        );

      console.log("api url call:" + url);
      // Use the constructed URL to make a GET request
      return spoonacularGet(
        url,
        defaultParams
      )(args.slice(urlPieces.length - 1));
    };
  }
}
