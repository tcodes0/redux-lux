export const action = {}
export const act = action
export function makeReducer(infoObject) {
  const { type, initialState, handler } = infoObject

  action[type] = createAction(type)
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

let _rootReducer
export function makeRootReducer(inputObject) {
  if (_rootReducer) {
    return _rootReducer
  }

  function rootReducer(state, action) {
    const nextState = Object.assign({}, state)
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const info of Object.values(inputObject)) {
      const reducer = makeReducer(info)
      const partialState = reducer(state, luxAction)
      if (!partialState) {
        continue
      }
      // console.log('new state', partialState)
      Object.assign(nextState, partialState)
    }
    return nextState
  }

  _rootReducer = rootReducer
  return _rootReducer
}
