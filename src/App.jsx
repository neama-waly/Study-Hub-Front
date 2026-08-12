import './App.css'
import Home from "./components/Home"
import{Routes,Route, useLocation} from 'react-router-dom'
import Notes from './components/Notes'
import Sidebar from "./components/Sidebar"
import Questions from './components/Questions'
import Login from "./components/Login"
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import Courses from './components/Courses'
import LogOut from "./components/LogOut"
function App() {
      const location = useLocation();
      const hide = location.pathname === "/Login" || location.pathname === "/SignUp" || location.pathname === "/Profile";
  return (
    <>
   
      <div className="mainpage">
        {!hide && <Sidebar/>}
      <div className='content-area' style={{flex :1}}>
       <Routes>
        <Route path="/" element={< Home/>} />
        <Route path='/Notes' element={< Notes />}/>
        <Route path="/Questions" element={< Questions/>}/>
        <Route path='/Login' element={< Login/>}/>
        <Route path='/SignUp' element={< SignUp/>}/>
        <Route path='/Profile' element={< Profile/>}/>
        <Route path='/Courses' element={< Courses/>}/>
        <Route path='/LogOut' element={< LogOut/>}/>
      </Routes>          
      </div>
      </div>     
    </>
  )
}

export default App
