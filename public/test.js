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

function submitForm() {
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const imageFile = formData.get("image");

  const reader = new FileReader();
  reader.readAsArrayBuffer(imageFile);
  reader.onload = function () {
    const binaryData = reader.result;
    fetch("/api/classifyIngredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: binaryData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("API request failed!");
        }
      })
      .then((responseText) => {
        alert("API request successful! Response: " + responseText);
      })
      .catch((error) => {
        alert(error);
      });
  };
}
