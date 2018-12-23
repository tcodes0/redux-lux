export const type = 'SET_VISIBILITY_FILTER'

export const initialState = {
  visibilityFilter: 'SHOW_ALL',
}

export const reducer = (state, payload) => {
  const { filter: visibilityFilter } = payload
  if (!visibilityFilter) {
    return state
  }
  return { visibilityFilter }
}
