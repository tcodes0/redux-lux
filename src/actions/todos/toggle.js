import { createAction } from "../../lux";

export const type = "TOGGLE_TODO";

export const initialState = {
  todos: []
};

export const reducer = (state = initialState, action) => {
  if (action.type === "@@redux/INIT") {
    return initialState;
  }
  if (action.type !== type) {
    return;
  }
  const { todos } = state;
  const { id } = action.payload;

  const newTodos = todos.map(todo => {
    if (todo.id !== id) {
      return todo;
    }
    const completed = !todo.completed;
    const result = {
      ...todo,
      completed
    };
    return result;
  });

  const result = {
    todos: newTodos
  };
  return result;
};

export default createAction(type);
