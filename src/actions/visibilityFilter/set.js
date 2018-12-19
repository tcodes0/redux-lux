import createAction from "../createAction";

// export const setVisibilityFilter = filter => ({
//   type: "SET_VISIBILITY_FILTER",
//   filter
// });

export const type = "SET_VISIBILITY_FILTER";

export const initialState = {
  visibility: "SHOW_ALL"
};

export const reducer = (state = initialState, action) => {
  const { filter: visibility } = action.payload;
  return { visibility };
};

export default createAction(type);
