export type JSObject<T = any> = { [key: string]: T }
export type Action<T = any> = JSObject<T> & { type: string }
export type LuxAction<P = any, T = any> = Action<T> & { payload: P }
export type Reducer = (state: JSObject, action: Action) => JSObject
export type LuxReducer = (state: JSObject, action: LuxAction) => JSObject
export type Defined<T> = T extends undefined ? never : T
export type IsFunction = (...args: Array<any>) => any
export type LuxModel = {
  type: string
  reducers: JSObject<LuxReducer>
}

export let types: JSObject<string> = {}
// default exported
let actions: JSObject<IsFunction> = {}

export function makeLuxAction(type: string) {
  function actionCreator(): { type: string; payload: JSObject<undefined> }
  function actionCreator<P>(
    payload: Defined<P>,
  ): { type: string; payload: Defined<P> }
  function actionCreator(payload?: any) {
    if (!payload) {
      payload = {}
    }
    const result = {
      type,
      payload,
    }
    return result
  }

  return actionCreator
}

function makeModelReducer<ActionCreator extends IsFunction>(
  namedParams: LuxModel & {
    createAction?: ActionCreator
  },
) {
  const { type, reducers, createAction } = namedParams
  const actionCreator = createAction || makeLuxAction

  actions[type] = actionCreator(type)
  types[type] = type

  function luxReducer(state: JSObject, action: LuxAction) {
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

export function makeLuxReducer<ActionCreator extends IsFunction>(namedParams: {
  rootReducer: Reducer
  initialState: JSObject
  createAction: ActionCreator
  models: Array<LuxModel>
}) {
  const { rootReducer, initialState, createAction, models } = namedParams

  function luxReducer(state = initialState, action: LuxAction) {
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
      const modelReducer = makeModelReducer<ActionCreator>({
        ...model,
        createAction,
      })
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

export default actions
