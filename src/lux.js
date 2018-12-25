const _actions = {}
_actions.type = {}

export function makeLuxAction(type) {
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

const _reducers = {}
export function makeModelReducer(info) {
  const { type, reducers, preferPayload, createAction } = info
  const _reducer = _reducers[type]
  if (_reducer) {
    return _reducer
  }

  const actionCreator = createAction || makeLuxAction
  _actions[type] = actionCreator(type)
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

let _luxReducer
export function makeLuxReducer(inputObject) {
  if (_luxReducer) {
    return _luxReducer
  }
  const {
    rootReducer,
    initialState,
    preferPayload,
    createAction,
    models,
  } = inputObject

  function luxReducer(state = initialState, action) {
    const nextState = Object.assign({}, state)
    const stateFromReducer = rootReducer
      ? rootReducer(nextState, action)
      : nextState
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const model of models) {
      const finalModel = preferPayload ? { ...model, preferPayload } : model
      const reducer = makeModelReducer({ ...finalModel, createAction })
      const partialState = reducer(stateFromReducer, luxAction)
      if (!partialState) {
        continue
      }
      console.log('new state', partialState)
      Object.assign(stateFromReducer, partialState)
    }
    return stateFromReducer
  }

  _luxReducer = luxReducer
  return _luxReducer
}

let _luxSaga
export function makeLuxSaga(inputObject) {
  if (_luxSaga) {
    return _luxSaga
  }
  const {
    preferPayload,
    models,
    luxSagaImplementation,
    takeEvery,
    all,
  } = inputObject

  if (!takeEvery || !all) {
    throw new Error(
      'To use makeLuxSaga or init you need to provide "takeEvery" and "all" in the argument object. Both are exported from redux-saga/effects.',
    )
  }

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

export default _actions
