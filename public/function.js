// The function here takes the parameters that you
// have declared in the `glide.json` file, in the
// same order.
window.function = function (upc) {
  // For each parameter, its `.value` contains
  // either its value in the type you've declared,
  // or it's `undefined`.  This is a good place to
  // extract the `.value`s and assign default
  // values.
  code = upc.value ?? "";

  // Your function should return the exact type
  // you've declared for the `result` in
  // `glide.json`, or `undefined` if there's an
  // error or no result can be produced, because a
  // required input is `undefined`, for example.
  // return str.substring(start, end);

  // return fetch(`/api/upc?code=${code}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  // }).then((res) => res.json());

  return test("/api/recepies", { query: "Burrito", number: 2 });
};

function test(endpoint, params) {
  return axios
    .get(endpoint, {
      params,
    })
    .then((res) => res.data);
}
