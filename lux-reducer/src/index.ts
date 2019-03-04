/* global Proxy */
import { deepCompareTypes, unpackArray } from './utils'

export type JSObject<ValueType = any> = { [key: string]: ValueType }
export type Action = {
  [key: string]: any
  type: string
}
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
  type: string | Array<string>
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
  const { type: packedType, reducers } = namedParams

  function luxReducer(state: JSObject, action: LuxAction) {
    // if type is a string we compare to the action
    if (typeof packedType === 'string' && action.type !== packedType) {
      // this model's lux reducer only responds to it's own action type
      return
    }
    // if it's an array we don't want to execute if action.type is not in the array
    if (
      Array.isArray(packedType) &&
      !packedType.some(type => type === action.type)
    ) {
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
let actions: JSObject<ActionCreatorFunction> = {}
let _models: Array<LuxModel>

export function makeLuxReducer<
  ActionCreator extends HigherOrderActionCreator
>(namedParams: {
  rootReducer?: Reducer
  initialState?: JSObject
  createAction?: ActionCreator
  models: Array<LuxModel>
}) {
  const { rootReducer, initialState, createAction, models } = namedParams
  // save reference to use later
  _models = models

  // populate actions and types exports for each model
  for (const model of models) {
    const { type: packedType, createAction: createActionModel, payload } = model
    const actionCreator = createActionModel || createAction || makeLuxAction
    // get types as strings from model.type
    for (const type of unpackArray(packedType)) {
      types[type] = type
      // runtime type safety of action payloads
      actions[type] = new Proxy(actionCreator(type), {
        apply: (
          target: typeof actions[string],
          thisArg: any,
          args: Array<any>,
        ) => {
          if (payload !== undefined && !deepCompareTypes(payload, args[0])) {
            throw `[Lux-reducer]: Payload type error. Action \`${type}\` expected payload\n\`${
              typeof payload === 'object' ? JSON.stringify(payload) : payload
            }\`\nbut got\n\`${
              typeof args[0] === 'object' ? JSON.stringify(args[0]) : args[0]
            }\`\n`
          }
          return target.call(thisArg, args[0])
        },
      })
    }
  }

  function luxReducer(state = initialState, action: Action) {
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

    // iterate models making lux reducers and calling them
    for (const model of models) {
      const modelLuxReducer = makeModelLuxReducer(model)
      const modelNextState = modelLuxReducer(
        withInitialState,
        luxAction as LuxAction,
      )
      if (!modelNextState) {
        continue
      }
      Object.assign(withInitialState, modelNextState)
    }
    return withInitialState
  }
  return luxReducer
}

// runtime type safety of action types
export default new Proxy(actions, {
  get: (target: JSObject, prop: string) => {
    if (target[prop] === undefined) {
      throw `[Lux-reducer]: Unknown action type. Type \`${prop}\` is not defined in any model. Valid actions:
        ${_models
          .map(m => m.type)
          .join(',\n        ')
          .toString()}`
    }
    return target[prop]
  },
})
