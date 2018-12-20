import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "./lidux";
import logger from "redux-logger";
import { reducer as add } from "./actions/todos/add";
import { reducer as toggle } from "./actions/todos/toggle";
import { reducer as set } from "./actions/visibilityFilter/set";

// prettier-ignore
const reducers = [
  add,
  toggle,
  set,
]
const reduxReducer = combineReducers(reducers);
const store = createStore(reduxReducer, applyMiddleware(logger));

export default store;
