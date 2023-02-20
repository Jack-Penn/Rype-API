const axios = require("axios").default;

exports.upcLookup = function (upc) {
  return axios
    .get("https://api.upcitemdb.com/prod/trial/lookup", {
      params: {
        upc,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    });
};
