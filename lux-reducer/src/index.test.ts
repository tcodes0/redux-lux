import actions, { makeLuxReducer, types } from '.'

describe('index test', () => {
  test('models: model reducer and correct action type', () => {
    const type = 'foo'
    const key = 'bar'
    const oldValue = { val: 1 }
    const newValue = { val: 2 }

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key]: modelReducer,
      },
    }
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = { type, payload: {} }
    const oldState = { [key]: oldValue }
    const expectedState = { [key]: newValue }
    const resultState = luxReducer(oldState, action)
    const expectedAction = {
      payload: expect.any(Object),
      type,
    }

    expect(resultState).toEqual(expectedState)
    expect(modelReducer).toHaveBeenCalledWith(oldValue, expectedAction)
  })

  test('models: model with type array', () => {
    const type = 'foo'
    const type2 = 'baz'
    const type3 = 'big'
    const key = 'bar'
    const oldValue = { val: 1 }
    const newValue = { val: 2 }

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type: [type, type2],
      reducers: {
        [key]: modelReducer,
      },
    }
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = { type, payload: {} }
    const action2 = { type: type2, payload: {} }
    const action3 = { type: type3, payload: {} }
    const oldState = { [key]: oldValue }
    const expectedState = { [key]: newValue }

    const resultState = luxReducer(oldState, action)
    expect(resultState).toEqual(expectedState)

    const resultState2 = luxReducer(oldState, action2)
    expect(resultState2).toEqual(expectedState)

    const resultState3 = luxReducer(oldState, action3)
    expect(resultState3).toEqual(oldState)

    const actionKeys = Object.keys(actions)
    const typeKeys = Object.keys(types)
    expect(actionKeys).toEqual([type, type2])
    expect(typeKeys).toEqual([type, type2])
  })

  test('models: create action', () => {
    const type = 'foo'
    const key = 'bar'
    const modelAction = (payload: any) => ({ type, other: 33, payload })
    const genericAction = () => ({ type: 'generic', bla: Boolean, payload: {} })

    const createAction = jest.fn(() => {
      return modelAction
    })
    const createActionGeneric = jest.fn(() => {
      return genericAction
    })
    const model = {
      type,
      reducers: {
        [key]: () => ({ val: 1 }),
      },
      createAction,
    }
    const luxReducer = makeLuxReducer({
      models: [model],
      createAction: createActionGeneric,
    })
    luxReducer({}, { type: 'foo', payload: [] })

    expect(createActionGeneric).not.toHaveBeenCalled()
    expect(createAction).toHaveBeenCalledWith(type)
    expect(typeof actions[type]).toBe('function')
    expect(actions[type].name).toBe(modelAction.name)
  })

  test('models: Create action with multiple models', () => {
    const type = 'foo'
    const type2 = 'boo'
    const key = 'bar'
    const modelAction = (payload: boolean) => ({ type, other: 33, payload })
    const modelAction2 = (payload: number) => ({
      type,
      other: 'hey',
      payload,
    })
    const genericAction = () => ({ type: 'generic', bla: Boolean, payload: {} })

    const createAction = jest.fn(() => {
      return modelAction
    })
    const createAction2 = jest.fn(() => {
      return modelAction2
    })
    const createActionGeneric = jest.fn(() => {
      return genericAction
    })
    const model = {
      type,
      reducers: {
        [key]: () => ({ val: 1 }),
      },
      createAction,
    }
    const model2 = {
      type: type2,
      reducers: {
        [key]: () => ({ val: 1 }),
      },
      createAction: createAction2,
    }
    const luxReducer = makeLuxReducer({
      models: [model, model2],
      createAction: createActionGeneric,
    })
    luxReducer({}, { type: 'foo', payload: [] })

    expect(createActionGeneric).not.toHaveBeenCalled()
    expect(createAction).toHaveBeenCalledWith(type)
    expect(createAction2).toHaveBeenCalledWith(type2)
    expect(typeof actions[type]).toBe('function')
    expect(typeof actions[type2]).toBe('function')
    expect(actions[type].name).toBe(modelAction.name)
    expect(actions[type2].name).toBe(modelAction2.name)
  })

  test('models: model reducer and not correct action type', () => {
    const type = 'foo'
    const type2 = 'daz'
    const key = 'bar'
    const oldValue = { val: 1 }
    const newValue = { val: 2 }

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type: type2,
      reducers: {
        [key]: modelReducer,
      },
    }
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = { type, payload: {} }
    const oldState = { [key]: oldValue }
    const resultState = luxReducer(oldState, action)

    expect(resultState).toEqual(oldState)
    expect(modelReducer).not.toHaveBeenCalled()
  })

  test('models: model reducers merge with old state', () => {
    const type = 'foo'
    const key = 'bar'
    const key2 = 'bag'
    const oldValue = { val: 1 }
    const newValue = { val: 2 }

    const modelReducer = jest.fn(() => {
      return newValue
    })
    const model = {
      type,
      reducers: {
        [key2]: modelReducer,
      },
    }
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = { type, payload: {} }
    const oldState = { [key]: oldValue }
    const reducerState = { [key2]: newValue }
    const expectedState = { ...oldState, ...reducerState }
    const resultState = luxReducer(oldState, action)

    expect(resultState).toEqual(expectedState)
  })

  test('models: model reducers merge together', () => {
    const type1 = 'foo'
    const type2 = 'koo'
    const key1 = 'bar'
    const key2 = 'bag'
    const oldValue1 = { val: 1 }
    const newValue1 = { val: 2 }
    const oldValue2 = { val: 'a' }
    const newValue2 = { val: 'b' }

    const modelReducer1 = jest.fn(() => {
      return newValue1
    })
    const modelReducer2 = jest.fn(() => {
      return newValue2
    })
    const model1 = {
      type: type1,
      reducers: {
        [key1]: modelReducer1,
      },
    }
    const model2 = {
      type: type2,
      reducers: {
        [key2]: modelReducer2,
      },
    }
    const luxReducer = makeLuxReducer({
      models: [model1, model2],
    })
    const action = { type: type1, payload: {} }
    const oldState = { [key1]: oldValue1, [key2]: oldValue2 }
    const reducerState = { [key1]: newValue1 }
    const expectedState = { ...oldState, ...reducerState }
    const resultState = luxReducer(oldState, action)

    expect(resultState).toEqual(expectedState)

    const action2 = { type: type2, payload: {} }
    const reducerState2 = { [key2]: newValue2 }
    const expectedState2 = { ...resultState, ...reducerState2 }
    const resultState2 = luxReducer(resultState, action2)

    expect(resultState2).toEqual(expectedState2)
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
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = { type, payload: {} }
    const oldState = { [key]: oldValue }
    const resultState = luxReducer(oldState, action)

    expect(resultState).toEqual(oldState)
  })

  test('initialState: merge with model reducers', () => {
    const type = 'foo'
    const key = 'bar'
    const key2 = 'bag'
    const oldValue = { val: 1 }
    const newValue = { val: 2 }
    const action = { type, payload: {} }
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
    const luxReducer = makeLuxReducer({
      initialState,
      models: [model],
    })
    const expectedState = { ...initialState, ...newState }
    const resultState = luxReducer(oldState, action)

    expect(resultState).toEqual(expectedState)
  })

  test('actions: payload is undefined defaulting to {}', () => {
    const type = 'foo'
    const key = 'bar'
    const newValue = { val: 2 }
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
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = actions[type]
    const expectedAction = { type, payload: {} }
    luxReducer(oldState, action())

    expect(modelReducer).toHaveBeenCalledWith(oldState, expectedAction)
  })

  test('actions: payload is defined', () => {
    const type = 'foo'
    const key = 'bar'
    const newValue = { val: 2 }
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
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = actions[type]
    const payload = 44
    const expectedAction = { type, payload }
    luxReducer(oldState, action(payload))

    expect(modelReducer).toHaveBeenCalledWith(oldState, expectedAction)
  })

  test('actions: payload is handled on stock actions with no payload', () => {
    const type = '@@redux/INIT'
    const key = 'bar'
    const newValue = { val: 2 }
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
    const luxReducer = makeLuxReducer({
      models: [model],
    })
    const action = { type }
    const expectedAction = { type, payload: {} }
    // @ts-ignore
    luxReducer(oldState, action)

    expect(modelReducer).toHaveBeenCalledWith(oldState, expectedAction)
  })

  test('actions: action object has type indexed fns', () => {
    const type = 'foo'
    const type2 = 'hoo'
    const type3 = 'loo'
    const key = 'bar'
    const newValue = { val: 2 }

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
    const luxReducer = makeLuxReducer({
      models: [model, model2, model3],
    })
    luxReducer(undefined, { type, payload: {} })

    expect(actions[type]).toEqual(expect.any(Function))
    expect(actions[type2]).toEqual(expect.any(Function))
    expect(actions[type3]).toEqual(expect.any(Function))
  })

  test('actions: types export has type indexed strings', () => {
    const type = 'foo'
    const type2 = 'hoo'
    const type3 = 'loo'
    const key = 'bar'
    const newValue = { val: 2 }

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
    const luxReducer = makeLuxReducer({
      models: [model, model2, model3],
    })
    luxReducer(undefined, { type, payload: {} })

    expect(types[type]).toEqual(type)
    expect(types[type2]).toEqual(type2)
    expect(types[type3]).toEqual(type3)
  })

  test('rootreducer: is called and overlaps with model reducers', () => {
    const type = 'foo'
    const key = 'bar'
    const oldValue = 1
    const newValue = { val: 2 }
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
    const luxReducer = makeLuxReducer({
      rootReducer,
      models: [model],
    })
    const action = { type, payload: {} }
    const oldState = { [key]: oldValue }
    const expectedState = { [key]: newValue }
    const resultState = luxReducer(oldState, action)

    expect(rootReducer).toHaveBeenCalledWith(oldState, action)
    expect(resultState).toEqual(expectedState)
  })

  test('rootreducer: merges state with model reducer', () => {
    const type = 'foo'
    const key = 'bar'
    const key2 = 'bat'
    const oldValue = { val: 1 }
    const newValue = { val: 2 }
    const reducerValue = { val: 3 }
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
    const luxReducer = makeLuxReducer({
      rootReducer,
      models: [model],
    })
    const action = { type, payload: {} }
    const oldState = { [key]: oldValue }
    const expectedState = { [key]: newValue, [key2]: reducerValue }
    const resultState = luxReducer(oldState, action)

    expect(resultState).toEqual(expectedState)
  })

  test('rootreducer: initialState call and overlap with initial and model', () => {
    const type = 'foo'
    const modelKey = 'bar'
    const reducerKey = 'bal'
    const initialKey = 'doo'
    const oldValue = { val: 1 }
    const newValue = { val: 2 }
    const reducerValue = { val: 3 }
    const oldReducerValue = { val: 4 }
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
    const luxReducer = makeLuxReducer({
      rootReducer,
      initialState,
      models: [model],
    })
    const action = { type, payload: {} }
    const resultState = luxReducer(undefined, action)

    expect(rootReducer).toHaveBeenCalledWith(initialState, action)
    expect(resultState).toEqual({
      ...initialState,
      ...reducerState,
      ...modelState,
    })
  })

  test('runtime: wrong payload throws', () => {
    const type = 'foo'
    const key = 'bar'
    const newValue = { val: 2 }
    const payloadExample = true

    const model = {
      type,
      payload: payloadExample,
      reducers: {
        [key]: () => newValue,
      },
    }
    makeLuxReducer({
      models: [model],
    })
    const action = actions[type]
    const correctPayload = true
    const correctPayload2 = false
    const wrongPayload = 34

    expect(() => action(correctPayload)).not.toThrow()
    expect(() => action(correctPayload2)).not.toThrow()
    expect(() => action(wrongPayload)).toThrow(/lux/i)
  })

  test('runtime: wrong payload doesnt throw if payload is not defined in model', () => {
    const type = 'foo'
    const key = 'bar'
    const newValue = { val: 2 }

    const model = {
      type,
      reducers: {
        [key]: () => newValue,
      },
    }
    makeLuxReducer({
      models: [model],
    })
    const action = actions[type]
    const wrongPayload = 34

    expect(() => action(wrongPayload)).not.toThrow()
  })

  test('runtime: undefined action types throw', () => {
    const type = 'foo'
    const type2 = 'bar'
    const key = 'bar'
    const newValue = { val: 2 }

    const model = {
      type,
      reducers: {
        [key]: () => newValue,
      },
    }

    const model2 = {
      type: type2,
      reducers: {
        [key]: () => newValue,
      },
    }
    makeLuxReducer({
      models: [model, model2],
    })
    expect(() => actions[type]).not.toThrow()
    expect(() => actions[type2]).not.toThrow()
    expect(() => actions.unknown).toThrow(/lux/i)
  })

  test('runtime: wrong payload hard cases', () => {
    const type = 'foo'
    const key = 'bar'
    const newValue = { val: 2 }
    const payloadExample = {
      id: 'foo',
      amount: { timestamp: 34343, value: 22223, hard: ['text'] },
      really: () => {},
    }
    const model = {
      type,
      payload: payloadExample,
      reducers: {
        [key]: () => newValue,
      },
    }
    makeLuxReducer({
      models: [model],
    })
    const action = actions[type]
    const wrongPayload = {}
    const wrongPayload2: Array<undefined> = []
    const wrongPayload3 = { id: 'bar' }
    const wrongPayload4 = { amount: [], id: 'bar' }
    const wrongPayload5 = [payloadExample, wrongPayload3]
    const wrongPayload6 = NaN
    const wrongPayload7 = null
    const wrongPayload8 = { bar: null }
    const wrongPayload9 = {
      id: 'foo',
      amount: { timestamp: 34343, value: 22223, hard: [44] },
      really: () => {},
    }
    const wrongPayload10 = [payloadExample, payloadExample]
    const wrongPayload11 = [payloadExample]
    const correctPayload = payloadExample

    expect(() => action(wrongPayload)).toThrow(/lux/i)
    expect(() => action(wrongPayload2)).toThrow(/lux/i)
    expect(() => action(wrongPayload3)).toThrow(/lux/i)
    expect(() => action(wrongPayload4)).toThrow(/lux/i)
    expect(() => action(wrongPayload5)).toThrow(/lux/i)
    expect(() => action(wrongPayload6)).toThrow(/lux/i)
    expect(() => action(wrongPayload7)).toThrow(/lux/i)
    expect(() => action(wrongPayload8)).toThrow(/lux/i)
    expect(() => action(wrongPayload9)).toThrow(/lux/i)
    expect(() => action(wrongPayload10)).toThrow(/lux/i)
    expect(() => action(wrongPayload11)).toThrow(/lux/i)
    expect(() => action(correctPayload)).not.toThrow()
  })
})
