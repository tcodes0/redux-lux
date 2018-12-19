const { resolve } = require("path");
const config = require(resolve("liduxrc"));

console.log("config", config);
const reducer = (state, action) => {
  return state;
};

module.exports = reducer;
