export function combineReducers(reducers) {
  return function reduxReducer(state, action) {
    const nextState = {};
    let liduxAction = {};

    if (!action.payload) {
      // redux actions like "@@redux/init" don't have payload
      liduxAction = { ...action, payload: {} };
    }

    for (const reducer of reducers) {
      const partialState = reducer(state, liduxAction);
      console.log("partial", partialState);
      Object.assign(nextState, partialState);
    }

    return nextState;
  };
}
