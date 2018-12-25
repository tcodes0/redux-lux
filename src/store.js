/* global window */
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { takeEvery, all } from 'redux-saga/effects'
import { init } from './lux'
import logger from 'redux-logger'
import * as add from './actions/todoAdd'
import * as toggle from './actions/filterToggle'
import * as set from './actions/todoSet'

const initialState = {
  todos: [],
  visibilityFilter: 'SHOW_ALL',
}

const sagaMiddleware = createSagaMiddleware()
const { luxReducer, luxSaga } = init({
  // createAction
  // luxSagaImplementation
  // rootReducer,
  takeEvery,
  all,
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
const store = createStore(
  luxReducer,
  comp(applyMiddleware(logger, sagaMiddleware)),
)
sagaMiddleware.run(luxSaga)

export default store
