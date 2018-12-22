import { connect } from 'react-redux'
import act from '../lux'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = state => {
  // debugger;
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  }
}

const mapDispatchToProps = {
  onTodoClick: id => act.TOGGLE_TODO({ id }),
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoList)

export default VisibleTodoList
