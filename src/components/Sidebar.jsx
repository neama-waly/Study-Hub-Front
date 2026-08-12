import home from "../assets/home-1-svgrepo-com.svg"
import course from"../assets/education-learning-26-svgrepo-com.svg"
import notes from "../assets/notes-svgrepo-com.svg"
import question from "../assets/question1-svgrepo-com.svg"
import logout from "../assets/logout-svgrepo-com.svg"
import '../App.css'
import { useNavigate } from "react-router-dom"

function Sidebar(){
    const navigate = useNavigate();

    return(
        <>
<>
  <div className="nav_bar">
    <button onClick={() => navigate("/")}>
      <img src={home} alt="Home" />
      <span>Home</span>
    </button>
    <button onClick={() => navigate("/Courses")}>
      <img src={course} alt="Courses" />
      <span>Courses</span>
    </button>
    <button onClick={() => navigate("/Notes")}>
      <img src={notes} alt="Notes" />
      <span>Notes</span>
    </button>
    <button onClick={() => navigate("/Questions")}>
      <img src={question} alt="Questions" />
      <span>Questions</span>
    </button>
    <button onClick={() => navigate("/LogOut")}>
      <img src={logout} alt="Logout" />
      <span>LogOut</span>
    </button>
  </div>
</>
         </>
    )
}
export default Sidebar;