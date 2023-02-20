const axios = require("axios").default;
require("dotenv").config();
const fs = require("fs");

{
  Object.assign(exports, {
    recepies: {
      find: spoonacularGet("https://api.spoonacular.com/recipes/complexSearch"),
      getInfo: (ids) => {
        spoonacularGet("https://api.spoonacular.com/recipes/informationBulk", {
          includeNutrition: false,
        })({
          ...arguments,
          ids: Array.isArray(ids) ? ids.join(",") : ids,
        });
      },
      getInstructions: getDataUrl(
        ["https://api.spoonacular.com/recipes/", "/analyzedInstructions"],
        { stepBreakdown: false }
      ),
    },

    ingredients: {
      getSubstitute: getDataUrl([
        "https://api.spoonacular.com/food/ingredients/",
        "/substitutes",
      ]),
      getUpcInfo: getDataUrl([
        "https://api.spoonacular.com/food/products/upc/",
      ]),

      classifyImage: (file) => {
        return axios
          .post(
            "https://api.spoonacular.com/food/images/classify",
            {
              file,
              apiKey: process.env.SPOON_API_KEY,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(
            (res) => res.data,
            (error) => console.log(error)
          );
      },
    },

    products: {},
  });

  function spoonacularGet(endpoint, defaultParams = {}) {
    return (params) => {
      return axios
        .get(endpoint, {
          params: {
            ...defaultParams,
            ...params,
            apiKey: process.env.SPOON_API_KEY,
          },
        })
        .then((res) => {
          console.log(endpoint + ":");
          console.log(res.data);
          return res.data;
        });
    };
  }

  function getDataUrl(urlPieces, defaultParams) {
    return (...args) => {
      spoonacularGet(
        [urlPieces]
          .flat()
          .slice(1)
          .reduce(
            (res, piece, i) => res + (args[i] ? args[i] : "") + piece,
            args[0]
          ),
        defaultParams
      )(args.slice(urlPieces.length - 1));
    };
  }
}
