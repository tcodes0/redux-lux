import { connect } from 'react-redux'
import Link from '../components/Link'
import act from 'lux-reducers'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(act.SET_VISIBILITY_FILTER(ownProps.filter))
  },
})

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Link)

export default FilterLink
