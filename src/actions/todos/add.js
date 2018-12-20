import createAction from "../createAction";

export const type = "ADD_TODO";

export const initialState = {
  todos: []
};

let id = 0;

export const reducer = (state = initialState, action) => {
  if (action.type === "@@redux/INIT") {
    return initialState;
  }
  if (action.type !== type) {
    return;
  }
  const { text } = action.payload;

  const todo = {
    id: ++id,
    text,
    completed: false
  };
  const todos = [...state.todos, todo];
  const result = {
    todos
  };
  return result;
};

export default createAction(type);
