function combineReducers(reducers) {
  for (const reducer of reducers) {
    console.log("red", reducer);
  }
}

module.exports = combineReducers;
