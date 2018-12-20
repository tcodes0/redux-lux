import createAction from "../createAction";

// export const setVisibilityFilter = filter => ({
//   type: "SET_VISIBILITY_FILTER",
//   filter
// });

export const type = "SET_VISIBILITY_FILTER";

export const initialState = {
  visibilityFilter: "SHOW_ALL"
};

export const reducer = (state = initialState, action) => {
  const { filter: visibilityFilter } = action.payload;
  if (!visibilityFilter) {
    return state
  }
  return { visibilityFilter };
};

export default createAction(type);
