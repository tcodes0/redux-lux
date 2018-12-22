export const act = {}
export const action = act

export function combineReducers(reducersObject) {
  const reducers = Object.values(reducersObject)

  return function rootReducer(state, action) {
    const nextState = Object.assign({}, state)
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const reducer of reducers) {
      const partialState = reducer(state, luxAction)
      if (!partialState) {
        continue
      }
      // console.log('new state', partialState)
      Object.assign(nextState, partialState)
    }
    return nextState
  }
}

export function reducerFrom(type, handler, initialState) {
  act[type] = createAction(type)

  return function reducer(state = initialState, action) {
    if (action.type === '@@redux/INIT') {
      return initialState
    }
    if (action.type !== type) {
      return
    }

    return handler(state, action.payload)
  }
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
