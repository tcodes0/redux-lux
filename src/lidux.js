export function combineReducers(reducers) {
  return function reduxReducer(state, action) {
    const nextState = Object.assign({}, state);
    // redux actions like "@@redux/INIT" don't have payload
    const liduxAction = action.payload ? action : { ...action, payload: {} };

    for (const reducer of reducers) {
      const partialState = reducer(state, liduxAction);
      if (!partialState) {
        continue;
      }
      console.log("new state", partialState);
      Object.assign(nextState, partialState);
    }
    return nextState;
  };
}
