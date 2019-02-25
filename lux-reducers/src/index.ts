import { Union, Literal, Static } from 'runtypes'

export type JSObject<T = any> = { [key: string]: T }
export type Action = { [key: string]: any; type: string }
export type LuxAction<P = any> = Action & { payload: P }
export type Reducer = (state: JSObject, action: Action) => JSObject | null
export type LuxReducer = (
  state: JSObject,
  action: LuxAction,
) => JSObject | undefined | null
export type Defined<T> = T extends undefined ? never : T
export type AnyFunction = (...args: Array<any>) => any
export type LuxModel = {
  type: string
  reducers: JSObject<LuxReducer>
}

export const types: JSObject<string> = {}
const actions: JSObject<AnyFunction> = {}

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

function makeModelReducer(namedParams: LuxModel) {
  const { type, reducers } = namedParams

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

export function test() {
  // models: Array<LuxModel>,
  // actionCreator: ActionCreator | typeof makeLuxAction,
  const literals = Object.keys(types).map(Literal)
  // @ts-ignore
  const typeEnum = Union(...literals)
  type TypeEnum = { [key: string]: Static<typeof typeEnum> }
  const result: TypeEnum = {}
  return result
}

export function makeLuxReducer<ActionCreator extends AnyFunction>(namedParams: {
  rootReducer?: Reducer
  initialState?: JSObject
  createAction?: ActionCreator
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
    // defineActionExports(models, createAction || makeLuxAction)

    for (const model of models) {
      const { type } = model
      const actionCreator = createAction || makeLuxAction
      actions[type] = actionCreator(type)
      types[type] = type

      const modelReducer = makeModelReducer(model)
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
