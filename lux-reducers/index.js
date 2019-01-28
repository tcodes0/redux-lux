// export default _action at end of file
let _action = {}
let _type = {}
export const type = _type

export function clearAction() {
  _action = {}
}

export function clearType() {
  _type = {}
}

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
  const { type, reducers, preferPayload, createAction } = info

  const actionCreator = createAction || makeLuxAction
  console.log('type', type)
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

  return luxReducer
}

export function makeLuxReducer(inputObject) {
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
      const modelInfo = preferPayload ? { ...model, preferPayload } : model
      const modelReducer = makeModelReducer({ ...modelInfo, createAction })
      const modelState = modelReducer(stateFromReducer, luxAction)
      if (!modelState) {
        continue
      }
      console.log('new state', modelState)
      Object.assign(stateFromReducer, modelState)
    }
    return stateFromReducer
  }

  return luxReducer
}

export default _action
