import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { init } from './lux'
import logger from 'redux-logger'
import * as add from './actions/todoAdd'
import * as toggle from './actions/filterToggle'
import * as set from './actions/todoSet'

const rootReducer = (state, action) => {
  console.log(state, action)
  return state
}

const sagaMiddleware = createSagaMiddleware()
const { rootReducer: reducer, rootSaga } = init({
  add,
  toggle,
  set,
  rootReducer,
})
const store = createStore(reducer, applyMiddleware(logger, sagaMiddleware))
sagaMiddleware.run(rootSaga)

export default store
