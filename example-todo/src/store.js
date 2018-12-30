/* global window */
import { createStore, applyMiddleware, compose } from 'redux'
import { makeLuxReducer } from 'lux-reducers'
import logger from 'redux-logger'
import * as add from './actions/todoAdd'
import * as toggle from './actions/filterToggle'
import * as set from './actions/todoSet'

const initialState = {
  todos: [],
  visibilityFilter: 'SHOW_ALL',
}

const luxReducer = makeLuxReducer({
  // createAction
  // luxSagaImplementation
  // rootReducer,
  preferPayload: true,
  initialState,
  // prettier-ignore
  models: [
    add,
    toggle,
    set,
  ]
})
const comp = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(luxReducer, comp(applyMiddleware(logger)))

export default store
