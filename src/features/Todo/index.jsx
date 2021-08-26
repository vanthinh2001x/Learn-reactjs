import React from 'react';
import PropTypes from 'prop-types';
import TodoList from './components/TodoList';

TodoFeatures.propTypes = {
    
};

function TodoFeatures(props) {
    const todoList = [
        {
            id: 1,
            title: 'Eat'
        },
        {
            id: 2,
            title: 'Sleep'
        },
        {
            id: 3,
            title: 'code'
        }
    ]
    return (
        <div>
            <h3>Todo List</h3>
            <TodoList todoList={todoList}/>
        </div>
    );
}

export default TodoFeatures;