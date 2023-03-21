// Listen for the 'message' event from the parent window.
window.addEventListener("message", async function (event) {
  // Extract 'origin' and 'key' & 'params' values from the received event data.
  const {
    origin,
    data: { key, params },
  } = event;

  let result;
  let error;

  try {
    // Call the function sent with the event, using the provided params.
    // Await the result, since it is an async function.
    result = await window.function(...params);
  } catch (e) {
    // If an error is thrown, handle it by assigning the error to the 'error' variable.
    result = undefined;
    try {
      error = e.toString();
    } catch (e) {
      error = "Exception can't be stringified.";
    }
  }

  // Create the response object containing the 'key', and the 'result' or 'error' (if applicable).
  const response = { key };
  if (result !== undefined) {
    // FIXME: Remove type once that's in staging
    // Add the 'result' to the response object with the value of the result.
    response.result = { value: result };
  }
  if (error !== undefined) {
    // Add the 'error' to the response object with the error message.
    response.error = error;
  }

  // Send the response back to the parent window.
  event.source.postMessage(response, "*");
});
