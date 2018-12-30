const _action = {}
// export default _action at end of file
const _type = {}
export const type = _type

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
  _action[type] = actionCreator(type)
  _type[type] = type

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

export default _action
