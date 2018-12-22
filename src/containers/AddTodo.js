import React from 'react'
import { connect } from 'react-redux'
import { log, act } from '../lux'

let AddTodo = ({ dispatch }) => {
  let input
  log()

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(act.ADD_TODO({ text: input.value }))
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  )
}
AddTodo = connect()(AddTodo)

export default AddTodo
