import React, { Component } from 'react';
import logo from './logo.svg';
import {TodoForm, TodoList, Footer} from './components/todo'
import './App.css';
import {addTodo,generateId,findById,toggleTodo,updateTodo,removeTodo,filterTodos} from './lib/todoHelpers'
import {pipe,partial} from './lib/utils'
import PropTypes from 'prop-types'
import {loadTodos,createTodo,saveTodo,destroyTodo} from './lib/todoService'

class App extends Component {
  state = {
      todos: [],
      currentTodo: ''
    }

    componentDidMount(){
      loadTodos().then(todos => this.setState({todos:todos}))
    }

  static contextTypes = {
    route: PropTypes.string
  }

    handleInputChange = (evt) => { 
      this.setState({
        currentTodo: evt.target.value 
      })
    }

  handleRemove = (id,evt) => {
      evt.preventDefault()
      const updatedTodos = removeTodo(this.state.todos,id)
      this.setState({
        todos:updatedTodos
      })

      destroyTodo(id).then(() => this.showTempMessage('Todo Remove'))
  }  

handleToggle = (id) => {
    const getToggledTodo = pipe(findById, toggleTodo)
    const updated = getToggledTodo(id, this.state.todos)
    const getUpdatedTodos = partial(updateTodo, this.state.todos)
    const updatedTodos = getUpdatedTodos(updated)
    this.setState({todos: updatedTodos})

    saveTodo(updated)
        .then(() => this.showTempMessage('Todo Updated'))
}

  handleSubmit = (evt) => {
    evt.preventDefault()
    const newId = generateId()
    const newTodo = {id: newId, name: this.state.currentTodo, isComplete: false}
    const updatedTodos = addTodo(this.state.todos, newTodo)
    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMessage: ''
    })
    createTodo(newTodo).then(() => this.showTempMessage("Todo added") )
  }

  showTempMessage = (msg) => {
    this.setState({message:msg})
    setTimeout(() => {
      this.setState({message:''})
    },2500)
  }

  handleEmptySubmit = (evt) => {
    evt.preventDefault()
    this.setState({
      errorMessage: 'Please supply a todo name'
    })
  }

  render() {
    const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit 
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Todo</h2>
        </div>
        <div className="Todo-App">
          {this.state.errorMessage && <h2>{this.state.errorMessage}</h2>}
          {this.state.message && <span className='success'>{this.state.message}</span>}
          <TodoForm currentTodo={this.state.currentTodo} handleInputChange={this.handleInputChange} handleSubmit={ submitHandler }/>
          <TodoList handleRemove={this.handleRemove} handleToggle={this.handleToggle} todos={displayTodos}/>
          <Footer/>
        </div>
      </div>
    );
  }
}

export default App;
