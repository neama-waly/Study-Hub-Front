import "../App.css";
import {Link} from "react-router-dom"
import { useState , useEffect } from "react";
import avatar from "../assets/gold-svgrepo-com.svg"


function Profile(){
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const [photo , setPhoto] = useState(avatar)


    const handlePhoto = async(e)=>{
        const file = e.target.files[0];
        if(!file) return ;

        const imageUrl = URL.createObjectURL(file);
        setPhoto(imageUrl);

        const formData = new FormData();
        formData.append("profileImage",file);

        try{
            const token = localStorage.getItem("token");
            const response = await fetch("https://study-hub-production-4e64.up.railway.app/api/profile/update-avatar",{
                method : "PUT",
                headers: {
                   "Authorization": `Bearer ${token}`,   
                },
                body : formData,
            });
            const data = await response.json();
            if(!response.ok){
                console.log("error updating ",data.message)
            }else{
                console.log("updated Successfully")
            }
            if (data.user && data.user.profileImage) {
    const imgPath = data.user.profileImage.replace(/\\/g, "/");
    const fullUrl = imgPath.startsWith("http") 
        ? imgPath 
        : `https://study-hub-production-4e64.up.railway.app/${imgPath.replace(/^\//, '')}`;
        
    setPhoto(fullUrl);
}

        }catch(e){
            console.log("Network error ",e)
        }

    }


    const getName = async()=>{
      try{
        const token = localStorage.getItem("token");
        const response = await fetch("https://study-hub-production-4e64.up.railway.app/api/profile",{
            method : "GET",
            headers : {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok){
            console.log(response.message)
            return;
            }
        const data = await response.json()
        setUserName(data.userName || data.name  ||"user");

            if (data.profileImage && data.profileImage !== "default-avatar.png") {
    const imgPath = data.profileImage.replace(/\\/g, "/");
    const fullUrl = imgPath.startsWith("http") 
        ? imgPath 
        : `https://study-hub-production-4e64.up.railway.app/${imgPath.replace(/^\//, '')}`;
        
    setPhoto(fullUrl);
}
        }catch(e){
            console.log(e);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect
            getName();
        },[])
    return(
        <div className="profile">
        <h1>Welcome {loading ? "..." : userName}</h1>
        <img src={photo} alt="Profile-Avatar" className="avatar"></img>

        <label htmlFor="image-upload" className="upload-badge">
            ➕   
        </label>
        <input
        id="image-upload"
        type="file"
        accept="image/*"
        style={{display:"none"}}
        onChange={handlePhoto}
        />
        <p className="signup">
         <Link to="/">Back to HOME</Link>
        </p>
        </div>
    )
}
export default Profile ;