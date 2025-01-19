import { BrowserRouter, Route, Routes } from "react-router-dom"
import { UserPage } from "./managers/userPage"
import { ToastContainer } from "react-toastify"
import { AdminPage } from "./managers/adminPage"


function App() {

  return (
    <div className='min-h-screen bg-slate-950'>
    <BrowserRouter>
        <UserPage/>
    </BrowserRouter>
           <ToastContainer />
    </div>
  )
}

export default App
