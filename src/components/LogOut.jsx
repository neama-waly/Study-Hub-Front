import "../App.css"
import { useNavigate } from "react-router-dom"
import {useEffect} from "react"
function LogOut(){
    const navigate = useNavigate();
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    }
}, [navigate]);
    const yesButton = ()=>{
        localStorage.removeItem("token");
        navigate("/Login")
    }
    const noButton = ()=>{
        navigate("/")
    }
    return(
        <>
        <h1>Are You Sure ?</h1>  
            <div>
                <button className="btn" onClick={yesButton}>Yes</button>
                <button className="btn" onClick={noButton}>No</button>
            </div>
        </>
    )
}
export default LogOut ;