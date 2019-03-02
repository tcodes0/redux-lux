import {
  JSObject,
  ActionCreatorFunction,
  Defined,
  LuxModel,
  LuxAction,
  HigherOrderActionCreator,
  Reducer,
} from './types'

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

export default function makeLuxReducer<
  ActionCreator extends HigherOrderActionCreator
>(namedParams: {
  rootReducer?: Reducer
  initialState?: JSObject
  createAction?: ActionCreator
  models: Array<LuxModel>
}) {
  const { rootReducer, initialState, createAction, models } = namedParams
  const types: JSObject<string> = {}
  const actions: JSObject<ActionCreatorFunction> = {}

  // populate actions and types variables
  for (const model of models) {
    const { type, createAction: createActionModel } = model
    const actionCreator = createActionModel || createAction || makeLuxAction
    actions[type] = actionCreator(type)
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
  return { luxReducer, types, actions }
}
