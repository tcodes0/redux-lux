import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from './lux'
import logger from 'redux-logger'
import { reducer as add } from './actions/todoAdd'
import { reducer as toggle } from './actions/filterToggle'
import { reducer as set } from './actions/todoSet'

const rootReducer = combineReducers({
  add,
  toggle,
  set,
})
const store = createStore(rootReducer, applyMiddleware(logger))

export default store
