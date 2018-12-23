import { delay } from 'redux-saga'
import { takeLatest } from 'redux-saga/effects'

let id = 0

export const type = 'ADD_TODO'

export const initialState = []

export const slice = 'todos'

export const reducer = (state, payload) => {
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

export function* saga() {
  yield delay(500)
  console.log('lol delay')
}

export const take = takeLatest
