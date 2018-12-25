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
export function makeLuxReducer(inputObject) {
  if (_rootReducer) {
    return _rootReducer
  }
  const {
    rootReducer: providedRootReducer,
    initialState,
    preferPayload,
    models,
  } = inputObject

  function rootReducer(state = initialState, action) {
    const nextState = Object.assign({}, state)
    const stateFromReducer = providedRootReducer
      ? providedRootReducer(nextState, action)
      : nextState
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const model of models) {
      const finalModel = preferPayload ? { ...model, preferPayload } : model
      const reducer = makeReducer(finalModel)
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

let _luxSaga
export function makeLuxSaga(inputObject) {
  if (_luxSaga) {
    return _luxSaga
  }
  const { preferPayload, models, luxSagaImplementation } = inputObject
  const { takeEvery, all } = require('redux-saga/effects')

  let sagas = []
  for (const model of models) {
    const finalModel = preferPayload ? { ...model, preferPayload } : model
    const { saga, take = takeEvery, type, preferPayload } = finalModel
    if (!saga) {
      continue
    }
    const sagaWithPayload = action => saga(action.payload)
    const sagaWithTake = take(type, preferPayload ? sagaWithPayload : saga)
    sagas.push(sagaWithTake)
  }

  function* defaultLuxSaga() {
    yield all(sagas)
  }

  _luxSaga = luxSagaImplementation
    ? luxSagaImplementation(sagas)
    : defaultLuxSaga
  return _luxSaga
}

export function init(inputObject) {
  const luxReducer = makeLuxReducer(inputObject)
  const luxSaga = makeLuxSaga(inputObject)
  return {
    luxReducer,
    luxSaga,
  }
}
