import { makeLuxReducer } from '.'

describe('makeLuxReducer test', () => {
  test('models: action matches type', () => {
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

  test('models: action doesnt match type', () => {
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

  test('models: reducers keys merge to state', () => {
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
})
