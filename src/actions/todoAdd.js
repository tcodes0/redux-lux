let id = 0

export const type = 'ADD_TODO'

export const initialState = {
  todos: [],
}

export const handler = (state, payload) => {
  const { text } = payload

  const todo = {
    id: ++id,
    text,
    completed: false,
  }
  const todos = [...state.todos, todo]
  const result = {
    todos,
  }
  return result
}
