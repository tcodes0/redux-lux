export type JSObject<T = any> = { [key: string]: T }

export type LuxAction<P = any> = {
  [key: string]: any
  type: string
  payload: P
}

// export type Action<P = any> = {
//   [key: string]: any
//   type: string
//   payload?: P
// }

export type Reducer<P = any> = (
  state: JSObject,
  action: { [key: string]: any; type: string; payload?: P },
) => JSObject | null

export type LuxReducer = (
  state: JSObject,
  action: LuxAction,
) => JSObject | undefined | null

export type Defined<T> = T extends undefined ? never : T

export type ActionCreatorFunction = (
  payload?: any,
  ...args: Array<any>
) => LuxAction

export type HigherOrderActionCreatorFunction = (
  ...args: Array<any>
) => ActionCreatorFunction

export type LuxModel<
  CreateAction extends HigherOrderActionCreatorFunction = HigherOrderActionCreatorFunction
> = {
  type: string
  reducers: JSObject<LuxReducer>
  createAction?: CreateAction
}
