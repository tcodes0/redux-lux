import { reducerFrom } from '../../lux'

let id = 0

const type = 'ADD_TODO'
const initialState = {
  todos: [],
}
const handler = (state, payload) => {
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

export const reducer = reducerFrom(type, handler, initialState)
