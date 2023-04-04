const axios = require("axios").default; // import axios library to make API requests
require("dotenv").config(); // import dotenv to use environment variables
const fs = require("fs"); // import fs to read/write files
const path = require("path");

{
  const CloudmersiveBarcodeapiClient = require("cloudmersive-barcodeapi-client");
  const defaultClient = CloudmersiveBarcodeapiClient.ApiClient.instance;

  // Configure API key authorization: Apikey
  const Apikey = defaultClient.authentications["Apikey"];
  Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;

  const apiInstance = new CloudmersiveBarcodeapiClient.BarcodeScanApi();

  const imageFile = Buffer.from(
    fs.readFileSync(path.join(__dirname, "ketchup barcode.jpg")).buffer
  ); // File | Image file to perform the operation on.  Common file formats such as PNG, JPEG are supported.

  Object.assign(exports, {
    imageBufferFromURL: (url) => {
      return axios
        .get(url, { responseType: "arraybuffer" })
        .then((res) => Buffer.from(res.data, "utf-8"));
      //   const response = await axios.get(url, { responseType: "arraybuffer" });
      //   return Buffer.from(response.data, "utf-8");
    },
    imageBufferFromPath: async (uri) => {
      return Buffer.from(fs.readFileSync(uri).buffer);
    },
    scanBarcode: (imageFile) =>
      new Promise((res, rej) => {
        apiInstance.barcodeScanImage(imageFile, (error, data, response) => {
          if (error) {
            rej(error);
          } else {
            console.log("API called successfully. Returned data");
            console.log(data);
            res(data);
          }
        });
      }),
  });
}
