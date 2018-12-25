export const type = 'SET_VISIBILITY_FILTER'

export const reducers = {
  visibilityFilter: (state, payload) => {
    if (!payload) {
      return
    }
    return payload
  },
}
