const _actions = {}
_actions.type = {}
export default _actions

const _reducers = {}
export function makeReducer(info) {
  const { type, reducers, preferPayload } = info
  const _reducer = _reducers[type]
  if (_reducer) {
    return _reducer
  }

  _actions[type] = createAction(type)
  _actions.type[type] = type

  function luxReducer(state, action) {
    if (action.type !== type) {
      return
    }

    let newState = {}
    for (const [slice, reducer] of Object.entries(reducers)) {
      const result = reducer(
        state[slice],
        preferPayload ? action.payload : action,
      )
      if (!result) {
        continue
      }
      newState = { ...newState, [slice]: result }
    }

    return newState
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
  const {
    rootReducer: providedRootReducer,
    initialState,
    preferPayload,
    ...actionInfos
  } = inputObject

  function rootReducer(state = initialState, action) {
    const nextState = Object.assign({}, state)
    const stateFromReducer = providedRootReducer
      ? providedRootReducer(nextState, action)
      : nextState
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const info of Object.values(actionInfos)) {
      const finalInfo = preferPayload ? { ...info, preferPayload } : info
      const reducer = makeReducer(finalInfo)
      const partialState = reducer(stateFromReducer, luxAction)
      if (!partialState) {
        continue
      }
      console.log('new state', partialState)
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
  const { preferPayload, ...actionInfos } = inputObject

  const { takeEvery, all } = require('redux-saga/effects')
  const sagas = Object.values(actionInfos).map(info => {
    const finalInfo = preferPayload ? { ...info, preferPayload } : info
    const { saga, take = takeEvery, type, preferPayload } = finalInfo
    if (saga) {
      const sagaWithPayload = action => saga(action.payload)
      const sagaWithTake = take(type, preferPayload ? sagaWithPayload : saga)
      return sagaWithTake
    }
    return undefined
  })

  function* defaultRootSaga() {
    yield all(sagas)
  }

  _rootSaga = defaultRootSaga
  return _rootSaga
}

export function init(inputObject) {
  const luxReducer = makeRootReducer(inputObject)
  const luxSaga = makeRootSaga(inputObject)
  return {
    luxReducer,
    luxSaga,
  }
}
