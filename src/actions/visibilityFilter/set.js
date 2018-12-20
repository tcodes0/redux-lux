import createAction from "../createAction";
import { reducerFrom } from "../../lidux";

export const type = "SET_VISIBILITY_FILTER";
export const initialState = {
  visibilityFilter: "SHOW_ALL"
};
export const handler = (state, payload) => {
  const { filter: visibilityFilter } = payload;
  if (!visibilityFilter) {
    return state;
  }
  return { visibilityFilter };
};

export const reducer = reducerFrom(type, handler, initialState)

export default createAction(type);
