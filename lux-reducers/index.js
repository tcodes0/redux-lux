// export default _action at end of file
let _action = {}
let _type = {}
_action.type = _type

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

function makeModelReducer(info) {
  const { type, reducers, createAction } = info
  const actionCreator = createAction || makeLuxAction

  _action[type] = actionCreator(type)
  _type[type] = type

  function luxReducer(state, action) {
    if (action.type !== type) {
      return
    }

    let newState = {}
    for (const [slice, reducer] of Object.entries(reducers)) {
      const result = reducer(state[slice], action)
      if (!result) {
        continue
      }
      newState = { ...newState, [slice]: result }
    }

    return newState
  }

  return luxReducer
}

export function makeLuxReducer(info) {
  const { rootReducer, initialState, createAction, models } = info

  function luxReducer(state = initialState, action) {
    // avoid bugs by creating new reference
    const nextState = { ...state }
    const stateFromReducer = rootReducer
      ? rootReducer(nextState, action)
      : nextState
    // pass to modelReducer some keys on initialState
    const withInitialState = { ...initialState, ...stateFromReducer }
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const model of models) {
      const modelReducer = makeModelReducer({ ...model, createAction })
      const modelState = modelReducer(withInitialState, luxAction)
      if (!modelState) {
        continue
      }
      Object.assign(withInitialState, modelState)
    }
    return withInitialState
  }

  return luxReducer
}

export default _action
