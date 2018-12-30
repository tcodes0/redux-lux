export const type = 'TOGGLE_TODO'

export const reducers = {
  todos: (state, payload) => {
    const newTodos = state.map(todo => {
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
    return newTodos
  },
}
