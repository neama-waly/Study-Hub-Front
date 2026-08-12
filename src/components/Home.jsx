import "../App.css"
import face from "../assets/profile-image-1348-svgrepo-com.svg"
import stitch from"../assets/ -2.jpg";
import { useNavigate } from "react-router-dom"
import {useEffect} from "react"


function Home(){
    const navigate = useNavigate();
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    }
}, [navigate]);
    return(
    <div className="container">
        <div className="title">
            <div className="actions">
                <h3 className="address">Study Hub </h3>
                <button className="icon-btn" onClick={()=>navigate("/Profile")}>
                    <img src={face}/>
                </button>
            </div>
        </div>
 
        <div className="welcome">
            <h1>Welcome back </h1>
            <p>keep learning, keep growing</p>
            <img className="stitch" src={stitch}/>
        </div>
        </div>
    )
}
export default Home ;