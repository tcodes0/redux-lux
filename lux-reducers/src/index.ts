import {
  JSObject,
  ActionCreatorFunction,
  Defined,
  LuxModel,
  LuxAction,
  HigherOrderActionCreatorFunction,
  Reducer,
} from './types'

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

export default function makeLuxReducer<
  ActionCreator extends HigherOrderActionCreatorFunction
>(namedParams: {
  rootReducer?: Reducer
  initialState?: JSObject
  createAction?: ActionCreator
  models: Array<LuxModel>
}) {
  const { rootReducer, initialState, createAction, models } = namedParams
  const types: JSObject<string> = {}
  const actions: JSObject<ActionCreatorFunction> = {}

  function luxReducer(state = initialState, action: LuxAction) {
    // avoid bugs by creating new reference
    const nextState = { ...state }
    const stateFromReducer = rootReducer
      ? rootReducer(nextState, action)
      : nextState
    // pass to modelReducer keys on initialState not changed by the rootReducer
    const withInitialState = { ...initialState, ...stateFromReducer }
    // redux actions like "@@redux/INIT" don't have payload
    const luxAction = action.payload ? action : { ...action, payload: {} }

    for (const model of models) {
      const { type, createAction: createActionModel } = model
      const actionCreator = createActionModel || createAction || makeLuxAction
      actions[type] = actionCreator(type)
      types[type] = type
      const modelReducer = makeModelReducer(model)
      const modelNextState = modelReducer(withInitialState, luxAction)
      if (!modelNextState) {
        continue
      }
      Object.assign(withInitialState, modelNextState)
    }
    return withInitialState
  }
  return { luxReducer, types, actions }
}
