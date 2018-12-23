const action = {}
export default action
let _isFirstAction = true

const _reducers = {}
export function makeReducer(exportedInfo) {
  const { type, initialState, reducer, slices } = exportedInfo
  const _reducer = _reducers[type]
  if (_reducer) {
    return _reducer
  }

  const slicedState = slices ? {} : initialState
  if (slices) {
    for (const slice of slices) {
      slicedState[slice] = initialState
    }
  }
  action[type] = createAction(type)

  function luxReducer(state = slicedState, action) {
    if (_isFirstAction && /^@@redux[/]INIT/.test(action.type)) {
      _isFirstAction = false
      return slicedState
    }
    if (action.type !== type) {
      return
    }

    const scopedState = slices
      ? slices.reduce((acc, slice) => {
          acc[slice] = state[slice]
          return acc
        }, {})
      : state

    const result = reducer(scopedState, action.payload)

    if (slices) {
      const newSlices = slices.reduce((acc, slice) => {
        acc[slice] = { ...state[slice], ...result[slice] }
        return acc
      }, {})
      return newSlices
    }
    return result
  }

  _reducers[type] = luxReducer
  return luxReducer
}

export function createAction(type) {
  return function actionCreator(payload) {
    if (!payload) {
      payload = {}
    }
    const result = {
      type,
      payload,
    }
    return result
  }
}

let _rootReducer
export function makeRootReducer(inputObject) {
  if (_rootReducer) {
    return _rootReducer
  }

  function rootReducer(state, action) {
    const nextState = Object.assign({}, state)
    const { rootReducer: providedRootReducer, ...rest } = inputObject
    const stateFromReducer = providedRootReducer
      ? providedRootReducer(nextState, action)
      : nextState
    // console.log('statefrom', stateFromReducer)
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const info of Object.values(rest)) {
      const reducer = makeReducer(info)
      const partialState = reducer(state, luxAction)
      if (!partialState) {
        continue
      }
      // console.log('new state', partialState)
      Object.assign(stateFromReducer, partialState)
    }
    return stateFromReducer
  }

  _rootReducer = rootReducer
  return _rootReducer
}

let _rootSaga
export function makeRootSaga(inputObject) {
  if (_rootSaga) {
    return _rootSaga
  }
  const { rootSaga: providedRootSaga, ...rest } = inputObject
  const { takeEvery, all } = require('redux-saga/effects')
  const sagas = Object.values(rest).map(info => {
    const { saga, take = takeEvery, type } = info
    if (saga) {
      const sagaWithTake = take(type, saga)
      return sagaWithTake
    }
    return undefined
  })

  function* rootSaga() {
    yield all(sagas)
  }

  _rootSaga = providedRootSaga ? providedRootSaga(sagas) : rootSaga
  return _rootSaga
}

export function makeRoot(inputObject) {
  const reducer = makeRootReducer(inputObject)
  const saga = makeRootSaga(inputObject)
  return {
    reducer,
    saga,
  }
}
