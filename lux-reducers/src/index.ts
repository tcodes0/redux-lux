/* global Proxy */
export type JSObject<ValueType = any> = { [key: string]: ValueType }

export type LuxAction<Payload = any> = {
  [key: string]: any
  type: string
  payload: Payload
}

export type Reducer<Payload = any> = (
  state: JSObject,
  action: { [key: string]: any; type: string; payload?: Payload },
) => JSObject | null

export type LuxReducer = (
  state: JSObject,
  action: LuxAction,
) => JSObject | undefined | null

export type Defined<It> = It extends undefined ? never : It

export type HigherOrderActionCreator<Payload = any> = (
  type: string,
) => ActionCreatorFunction<Payload>

export type ActionCreatorFunction<Payload = any> = (
  payload?: Payload,
) => LuxAction

export type LuxModel<
  CreateAction extends HigherOrderActionCreator = HigherOrderActionCreator
> = {
  type: string
  payload?: any
  reducers: JSObject<LuxReducer>
  createAction?: CreateAction
}

export function makeLuxAction(type: string) {
  // overload with no args
  function actionCreator(): { type: string; payload: JSObject<undefined> }
  // overload with 1 args, the payload
  function actionCreator<P>(
    payload: Defined<P>,
  ): { type: string; payload: Defined<P> }
  function actionCreator<P = any>(payload?: JSObject<undefined> | Defined<P>) {
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

function makeModelLuxReducer(namedParams: LuxModel) {
  const { type, reducers } = namedParams

  function luxReducer(state: JSObject, action: LuxAction) {
    // this model's lux reducer only responds to it's own action type
    if (action.type !== type) {
      return
    }
    let newState = {}
    for (const [slice, reducer] of Object.entries(reducers)) {
      // call reducers in model to get their new states
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

export const types: JSObject<string> = {}
const actions: JSObject<ActionCreatorFunction> = {}

export function makeLuxReducer<
  ActionCreator extends HigherOrderActionCreator
>(namedParams: {
  rootReducer?: Reducer
  initialState?: JSObject
  createAction?: ActionCreator
  models: Array<LuxModel>
}) {
  const { rootReducer, initialState, createAction, models } = namedParams

  // populate actions and types variables
  for (const model of models) {
    const { type, createAction: createActionModel, payload } = model
    const actionCreator = createActionModel || createAction || makeLuxAction
    const validator = (arg: any) => {
      if (typeof payload === 'undefined') {
        return
      }
      if (typeof arg !== typeof payload) {
        throw 'errr'
      }
    }
    const handler = {
      apply: function(
        target: typeof actions[string],
        thisArg: any,
        argumentsList: Array<any>,
      ) {
        validator(argumentsList[0])
        return target.call(thisArg, argumentsList[0])
      },
    }
    actions[type] = new Proxy(actionCreator(type), handler)
    types[type] = type
  }

  function luxReducer(state = initialState, action: LuxAction) {
    // avoid bugs by creating new reference
    const nextState = { ...state }
    // call rootReducer provided as argument, if it is defined
    const stateFromReducer = rootReducer
      ? rootReducer(nextState, action)
      : nextState
    // pass to modelReducer keys on initialState not changed by the rootReducer
    const withInitialState = { ...initialState, ...stateFromReducer }
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    // iterate models making root reducers and calling them
    for (const model of models) {
      const modelLuxReducer = makeModelLuxReducer(model)
      const modelNextState = modelLuxReducer(withInitialState, luxAction)
      if (!modelNextState) {
        continue
      }
      Object.assign(withInitialState, modelNextState)
    }
    return withInitialState
  }
  return luxReducer
}

export default actions
