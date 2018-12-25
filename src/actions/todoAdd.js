import { delay } from 'redux-saga'
import { takeLatest } from 'redux-saga/effects'

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

export function* saga() {
  yield delay(500)
  console.log('lol delay')
}

export const take = takeLatest
