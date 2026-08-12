import "../App.css"
import {useNavigate , Link} from "react-router-dom";
import { useState } from 'react';
function SignUp(){
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password , setPassword] = useState("");
    const handleSign = async(e)=>{
        e.preventDefault();
        try{
        const response = await fetch("study-hub-production-4e64.up.railway.app/api/signup",{
        method : "POST" ,
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({userName ,password }),
      })
        const data = await response.json();
        if(response.ok){
            alert(data.message);
            navigate("/");
        }else{
        alert(data.message)
      }          
        }catch(e){
            console.log(e);
        }
    }

    return(
        <div className="Login">
        <h1>SignUp NOW</h1>
        <p>Let`s start our journey</p>
        <input 
        placeholder="Enter User_Name"
        type="text"
        value={userName} onChange={(e)=> setUserName(e.target.value)}
        />
        <input 
        placeholder="Enter PassWord"
        type="password"
        value={password} onChange={(e)=> setPassword(e.target.value)}
        />        
        <button onClick={handleSign}>
            Submit
        </button>
        <p className="signup">
            Back To <Link to="/Login">Login</Link>
        </p>
        </div>
    )
}
export default SignUp ;