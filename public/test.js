const upcInput = document.getElementById("upcInput");
const output = document.getElementById("output");

document.getElementById("test-button").addEventListener("click", () => {
  window
    .function(upcInput)
    .then((data) => {
      console.log(data);
      output.innerHTML = JSON.stringify(data);
    })
    .catch((err) => console.log(err));
});

function uploadFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      // The binary data of the image is available as e.target.result
      var binaryData = e.target.result;
      console.log(binaryData); // Display binary data in console for testing purposes
      axios
        .post("/api/classifyIngredient", {
          image: binaryData,
        })
        .then((res) => console.log(res.data));
    };
    reader.readAsBinaryString(input.files[0]);
  }
}
