import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from './lux'
import logger from 'redux-logger'
import { reducer as add } from './actions/todoAdd'
import { reducer as toggle } from './actions/filterToggle'
import { reducer as set } from './actions/todoSet'

// prettier-ignore
const reducers = [
  add,
  toggle,
  set,
]
const reduxReducer = combineReducers(reducers)
const store = createStore(reduxReducer, applyMiddleware(logger))

export default store
