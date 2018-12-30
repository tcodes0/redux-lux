let id = 0

export const type = 'ADD_TODO'

export const reducers = {
  todos: (state, payload) => {
    const todo = {
      id: ++id,
      text: payload,
      completed: false,
    }
    const todos = [...state, todo]
    return todos
  },
}
