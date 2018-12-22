import { createStore, applyMiddleware } from 'redux'
import { makeRootReducer } from './lux'
import logger from 'redux-logger'
import * as add from './actions/todoAdd'
import * as toggle from './actions/filterToggle'
import * as set from './actions/todoSet'

const rootReducer = makeRootReducer({
  add,
  toggle,
  set,
})
const store = createStore(rootReducer, applyMiddleware(logger))

export default store
