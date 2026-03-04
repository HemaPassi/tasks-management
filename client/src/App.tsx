
import Navbar from "./components/Navbar"
import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import './App.css'

//export const BASE_URL = "http://localhost:5000/api"
//export const BASE_URL = import.meta.env.VITE_API_URL;
//export const BASE_URL = "https://tasks-management-hfy0.onrender.com/api"


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
