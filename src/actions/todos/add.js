import createAction from "../createAction";

// export const addTodo = text => ({
//   type,
//   id: nextTodoId++,
//   text
// });

export const type = "ADD_TODO";

export const initialState = {
  todos: []
};

export const reducer = (state = initialState, action) => {
  const { id, text } = action.payload;

  const todo = {
    id,
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
