import { reducerFrom } from '../../lux'

const type = 'TOGGLE_TODO'
const initialState = {
  todos: [],
}
const handler = (state, payload) => {
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

export const reducer = reducerFrom(type, handler, initialState)
