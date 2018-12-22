export const type = 'TOGGLE_TODO'

export const initialState = {
  todos: [],
}

export const handler = (state, payload) => {
  const { todos } = state
  const { id } = payload

  const newTodos = todos.map(todo => {
    if (todo.id !== id) {
      return todo
    }
    const completed = !todo.completed
    const result = {
      ...todo,
      completed,
    }
    return result
  })

  const result = {
    todos: newTodos,
  }
  return result
}
