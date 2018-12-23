export const type = 'SET_VISIBILITY_FILTER'

export const initialState = 'SHOW_ALL'

export const slice = 'visibilityFilter'

export const reducer = (state, payload) => {
  if (!payload) {
    return state
  }
  return { visibilityFilter: payload }
}
