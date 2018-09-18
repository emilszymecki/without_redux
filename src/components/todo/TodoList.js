import React from "react";
import {TodoItem} from './TodoItem'
import PropTypes from 'prop-types'

export const TodoList = (props) => {
	return (
			<ul>
				{props.todos.map(todo => {
					return (
						<TodoItem handleRemove={props.handleRemove} handleToggle={props.handleToggle} key={todo.id} {...todo} />
					);
				})}
			</ul>
	);
};

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  handleToggle: PropTypes.func.isRequired
}
