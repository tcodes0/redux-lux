import { reducerFrom } from '../lux'

const type = 'SET_VISIBILITY_FILTER'
const initialState = {
  visibilityFilter: 'SHOW_ALL',
}
const handler = (state, payload) => {
  const { filter: visibilityFilter } = payload
  if (!visibilityFilter) {
    return state
  }
  return { visibilityFilter }
}

export const reducer = reducerFrom(type, handler, initialState)
