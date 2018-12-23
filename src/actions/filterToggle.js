export const type = 'TOGGLE_TODO'

export const initialState = []

export const slice = 'todos'

export const reducer = (state, payload) => {
  const { todos } = state

  const newTodos = todos.map(todo => {
    if (todo.id !== payload) {
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
