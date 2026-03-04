//import { useState } from 'react'

import Navbar from "./components/Navbar"
import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import './App.css'

export const BASE_URL = "http://localhost:5000/api"


function App() {
  return (
    <div>
    <Navbar></Navbar>
    <div className="container">
       <TodoForm></TodoForm>
      <TodoList></TodoList> 
    </div>
    </div>
  )
}

export default App
