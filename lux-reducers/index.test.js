import act, { makeLuxReducer } from '.'

describe('index test', () => {
  test('models: model reducer and correct action type', () => {
    const type = 'foo'
    const key = 'bar'
    const oldValue = 1
    const newValue = 2

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model],
    })
    const action = { type }
    const oldState = { [key]: oldValue }
    const expectedState = { [key]: newValue }
    const resultState = reducer(oldState, action)
    const expectedAction = {
      payload: expect.any(Object),
      type,
    }

    expect(resultState).toEqual(expectedState)
    expect(modelReducer).toHaveBeenCalledWith(oldValue, expectedAction)
  })

  test('models: model reducer and not correct action type', () => {
    const type = 'foo'
    const type2 = 'daz'
    const key = 'bar'
    const oldValue = 1
    const newValue = 2

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type: type2,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model],
    })
    const action = { type }
    const oldState = { [key]: oldValue }
    const resultState = reducer(oldState, action)

    expect(resultState).toEqual(oldState)
    expect(modelReducer).not.toHaveBeenCalled()
  })

  test('models: model reducers merge with old state', () => {
    const type = 'foo'
    const key = 'bar'
    const key2 = 'bag'
    const oldValue = 1
    const newValue = 2

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key2]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model],
    })
    const action = { type }
    const oldState = { [key]: oldValue }
    const reducerState = { [key2]: newValue }
    const expectedState = { ...oldState, ...reducerState }
    const resultState = reducer(oldState, action)

    expect(resultState).toEqual(expectedState)
  })

  test('models: reducers can return falsey', () => {
    const type = 'foo'
    const key = 'bar'
    const oldValue = 1

    const modelReducer = jest.fn(() => undefined)
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model],
    })
    const action = { type }
    const oldState = { [key]: oldValue }
    const expectedState = oldState
    const resultState = reducer(oldState, action)

    expect(resultState).toEqual(expectedState)
  })

  test('initialState: merge with model reducers', () => {
    const type = 'foo'
    const key = 'bar'
    const key2 = 'bag'
    const oldValue = 1
    const newValue = 2
    const action = { type }
    const initialState = { [key2]: oldValue }
    const oldState = undefined
    const newState = { [key]: newValue }

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      initialState,
      models: [model],
    })
    const expectedState = { ...initialState, ...newState }
    const resultState = reducer(oldState, action)

    expect(resultState).toEqual(expectedState)
  })

  test('actions: payload is {}', () => {
    const type = 'foo'
    const key = 'bar'
    const newValue = 2
    const action = act[type]
    const oldState = undefined

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model],
    })
    const expectedAction = { type, payload: {} }
    reducer(oldState, action())

    expect(modelReducer).toHaveBeenCalledWith(oldState, expectedAction)
  })

  test('actions: payload is custom', () => {
    const type = 'foo'
    const key = 'bar'
    const newValue = 2
    const action = act[type]
    const oldState = undefined

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model],
    })
    const expectedPayload = 44
    const expectedAction = { type, payload: expectedPayload }
    reducer(oldState, action(expectedPayload))

    expect(modelReducer).toHaveBeenCalledWith(oldState, expectedAction)
  })

  test('actions: action object has type indexed fns', () => {
    const type = 'foo'
    const type2 = 'hoo'
    const type3 = 'loo'
    const key = 'bar'
    const newValue = 2

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const model2 = {
      type: type2,
      reducers: {
        [key]: modelReducer,
      },
    }
    const model3 = {
      type: type3,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model, model2, model3],
    })
    reducer(undefined, { type })

    expect(act[type]).toEqual(expect.any(Function))
    expect(act[type2]).toEqual(expect.any(Function))
    expect(act[type3]).toEqual(expect.any(Function))
  })

  test('actions: action.type object has type indexed strings', () => {
    const type = 'foo'
    const type2 = 'hoo'
    const type3 = 'loo'
    const key = 'bar'
    const newValue = 2

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const model2 = {
      type: type2,
      reducers: {
        [key]: modelReducer,
      },
    }
    const model3 = {
      type: type3,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      models: [model, model2, model3],
    })
    reducer(undefined, { type })

    expect(act.type[type]).toEqual(type)
    expect(act.type[type2]).toEqual(type2)
    expect(act.type[type3]).toEqual(type3)
  })

  test('rootreducer: is called and overlaps with model reducers', () => {
    const type = 'foo'
    const key = 'bar'
    const oldValue = 1
    const newValue = 2
    const reducerValue = 3
    const reducerState = { [key]: reducerValue }

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const rootReducer = jest.fn(() => {
      return reducerState
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      rootReducer,
      models: [model],
    })
    const action = { type }
    const oldState = { [key]: oldValue }
    const expectedState = { [key]: newValue }
    const resultState = reducer(oldState, action)

    expect(rootReducer).toHaveBeenCalledWith(oldState, action)
    expect(resultState).toEqual(expectedState)
  })

  test('rootreducer: merges state with model reducer', () => {
    const type = 'foo'
    const key = 'bar'
    const key2 = 'bat'
    const oldValue = 1
    const newValue = 2
    const reducerValue = 3
    const reducerState = { [key2]: reducerValue }

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const rootReducer = jest.fn(() => {
      return reducerState
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const reducer = makeLuxReducer({
      rootReducer,
      models: [model],
    })
    const action = { type }
    const oldState = { [key]: oldValue }
    const expectedState = { [key]: newValue, [key2]: reducerValue }
    const resultState = reducer(oldState, action)

    expect(resultState).toEqual(expectedState)
  })

  test('rootreducer: initialState call and overlap with initial and model', () => {
    const type = 'foo'
    const modelKey = 'bar'
    const reducerKey = 'bal'
    const initialKey = 'doo'
    const oldValue = 1
    const newValue = 2
    const reducerValue = 3
    const oldReducerValue = 4
    const initialValue = 'baz'
    const reducerState = { [reducerKey]: reducerValue }

    const rootReducer = jest.fn(() => {
      return reducerState
    })
    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [modelKey]: modelReducer,
      },
    }
    const initialState = {
      [modelKey]: oldValue,
      [reducerKey]: oldReducerValue,
      [initialKey]: initialValue,
    }
    const modelState = { [modelKey]: newValue }
    const reducer = makeLuxReducer({
      rootReducer,
      initialState,
      models: [model],
    })
    const action = { type }
    const resultState = reducer(undefined, action)

    expect(rootReducer).toHaveBeenCalledWith(initialState, action)
    expect(resultState).toEqual({
      ...initialState,
      ...reducerState,
      ...modelState,
    })
  })
})
