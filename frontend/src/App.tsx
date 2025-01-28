import { BrowserRouter } from "react-router-dom"
import { UserPage } from "./managers/userPage"
import { ToastContainer } from "react-toastify"
import { UserProvider } from "./hooks/UserContext"


function App() {

  return (
    <div className='min-h-screen bg-slate-950'>
    <BrowserRouter>
    <UserProvider>
        <UserPage/>
    </UserProvider>
    </BrowserRouter>
           <ToastContainer />
    </div>
  )
}

export default App
