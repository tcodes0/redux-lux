import { makeLuxReducer } from '.'

describe('makeLuxReducer test', () => {
  test('models', () => {
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
})
