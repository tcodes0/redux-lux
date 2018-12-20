export function combineReducers(reducers) {
  return function reduxReducer(state, action) {
    const nextState = {};
    // redux actions like "@@redux/init" don't have payload
    const liduxAction = action.payload ? action : { ...action, payload: {} };

    for (const reducer of reducers) {
      console.log("reducer args", reducer.name, state, liduxAction);
      const partialState = reducer(state, liduxAction);
      console.log("partial", partialState);
      Object.assign(nextState, partialState);
    }

    return nextState;
  };
}
