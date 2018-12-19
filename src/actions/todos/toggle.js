import createAction from "../createAction";

// export const toggleTodo = id => ({
//   type: "TOGGLE_TODO",
//   id
// });

export const type = "TOGGLE_TODO";

export const reducer = (state, action) => {
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
