import createAction from "../createAction";

export const type = "SET_VISIBILITY_FILTER";

export const initialState = {
  visibilityFilter: "SHOW_ALL"
};

export const reducer = (state = initialState, action) => {
  if (action.type === "@@redux/INIT") {
    return initialState;
  }
  if (action.type !== type) {
    return;
  }
  const { filter: visibilityFilter } = action.payload;
  if (!visibilityFilter) {
    return state;
  }
  return { visibilityFilter };
};

export default createAction(type);
