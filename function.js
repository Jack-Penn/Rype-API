// The function here takes the parameters that you
// have declared in the `glide.json` file, in the
// same order.
window.function = function (str, start, end) {
  // For each parameter, its `.value` contains
  // either its value in the type you've declared,
  // or it's `undefined`.  This is a good place to
  // extract the `.value`s and assign default
  // values.
  upc = upc.value ?? "";
  start = start.value ?? 0;
  end = end.value;

  // Your function should return the exact type
  // you've declared for the `result` in
  // `glide.json`, or `undefined` if there's an
  // error or no result can be produced, because a
  // required input is `undefined`, for example.
  // return str.substring(start, end);

  let result;

  return fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`).then(
    (res) => {
      console.log(res);
      return res;
    }
  );
};
