import { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom"
import searchicon from "../assets/search-alt-2-svgrepo-com.svg"
import { useCallback } from "react";


function Courses(){
    const [courses , setCourses] = useState([]);
    const [title , setTitle] = useState("");
    const [subject , setSubject] = useState("");
    const [fileUrl , setFileUrl] = useState("");
    const [fileType , setFileType] = useState("PDF");
    const [loading ,setLoading] = useState(false);
    const [restart ,setRestart] = useState(0);
    const [showForm ,setShowForm] = useState(false);
    const [searchterm , setSearchterm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    }
}, [navigate]);

    const LoadCourses =useCallback(async (query = "") =>{
        try{
            const token = localStorage.getItem("token");
            setLoading(true);
            const response = await fetch(`study-hub-production-4e64.up.railway.app/api/materials?search=${encodeURIComponent(query)}`,{
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json"
  }
});
            if(!response.ok) {
                const err = await response.json();
                console.log(err.message);
                return;
            }
            const course = await response.json();
            console.log("Courses from server:", course);
            setCourses(course);
            setLoading(false);
        }catch(e){
            console.log(e);
        }
    },[])
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        LoadCourses(searchterm);
    },[LoadCourses, restart, searchterm])

    const addCourse = async(e)=>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!title.trim() || !subject.trim() ) return;

        const formData = new FormData();
        formData.append("title",title);
        formData.append("subject",subject);
        formData.append("fileType",fileType || "PDF");
        formData.append("file",fileUrl); 


        try{
            const response = await fetch("study-hub-production-4e64.up.railway.app/api/materials",{
                method : "POST",
                headers : {
                    "Authorization": `Bearer ${token}`
                },
                body : formData ,
            })
      const data = await response.json();
      if(response.ok){
        const newCourse = data.material || data ;
        setCourses((previos)=>[newCourse, ...previos]);
        setTitle("");
        setSubject("");
        setFileUrl(null);
        setFileType("PDF");
        setShowForm(false);
        setRestart(prev => prev+1)
        
      }else{
        console.error("Failed to add Course")
        console.log(response.message)
        console.log("data errored :" ,data)
      }            
        }catch(e){
            console.log(e);
        }
    }
    const deleteCourse = async(id)=>{
        const token = localStorage.getItem("token");
        try{
            const response = await fetch(`study-hub-production-4e64.up.railway.app/api/materials/${id}`,{
                method : "DELETE",
                headers : {
                    "Authorization": `Bearer ${token}`
                }
            })
            if(response.ok){
                setCourses((prev)=>prev.filter(course => course._id !== id));
                console.log("Deleted Successfully ")
            }else {
            console.error("Failed to delete cousre");
            console.log(response.message)
        }

        } catch (error) {
        console.log("Error deleting notes:", error);
    }
    }
    const UpdateProgress = async(courseId , newProgress)=>{
        const numericProgress = Number(newProgress);
        setCourses(prev =>
            prev.map(c => c._id === courseId ? { ...c, progress: numericProgress } : c));


        try{
            const token = localStorage.getItem("token");
            const response =await fetch(`study-hub-production-4e64.up.railway.app/api/materials/${courseId}/progress`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ progress: newProgress })
            });
            const data = await response.json();
            if(!response.ok){
                console.log("Error Failed to update progress",data.message)
            }else{
                console.log("Saved Progress",data.message)
            }
            
        
        }catch(err){
            console.log("Failed "+err)
        }
    }
    return(
        <div>
        <h1>Courses</h1>
        <div className="top-actions" >
         <button className="btn" 
        onClick={()=>{ setShowForm(!showForm) 
        }}>{showForm ? "Cancel" : "+ ADD COURSE"}
        </button>
        <span className="search">
                <input  type="text" placeholder="Search..."
                value={searchterm} 
                onChange={(e)=> setSearchterm(e.target.value)}/>
                    <button className= "icon-btn img" type="button">
                        <img src={searchicon}/>
                    </button>
            </span>        
        </div>
        <div className="courses">
        {showForm &&(
            <form onSubmit={addCourse}
            style={{width : "70%" , marginTop : "20px"}}
            >
                <h3>Create new Course</h3>
                <input
                className="inputform"
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            required         
                />
                <input
                className="inputform"
                placeholder="Write Subject "
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                />
                <input 
                placeholder="Upload your file"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => setFileUrl(e.target.files[0])}
                required
                />
                           
                <div className="selectGroup">
                    <label>Material Type : </label>
                    <select 
                    className="inputform"
                    value={fileType}
                    onChange={(e)=> setFileType(e.target.value)}
                    >
                        <option value={"PDF"}>PDF</option>
                        <option value={"Summary"}>Summary</option>
                        <option value={"Quiz"}>Quiz</option>
                        <option value={"Lecture"}>Lecture</option>
                        <option value={"Other"}>Other</option>

                    </select>
                </div> 
                       
                <button className="formbtn" type="submit"           
                >Upload Course</button>

            </form>
        )}
        {loading ? (
  <p>LOADING....</p>
) : courses && courses.length > 0 ? (
  courses.map((singleCourse) => (
    <div className="courseCard" key={singleCourse._id}>
      <div className="cardHeader">
        <span className="badge">{singleCourse.subject || "Course"}</span>
        <button
          onClick={() => deleteCourse(singleCourse._id)}
          className="deleteCoursebtn"
        >
          🗑️
        </button>
      </div>
      <h3 className="noteTitle">{singleCourse.title}</h3>

      <div className="resourseBox">
        <span className="fileTypeBadge">
          {singleCourse.fileType || "PDF "}
        </span>
        {singleCourse.fileUrl && (
          <a
            className="link"
            href={singleCourse.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resource ↗
          </a>
        )}
      </div>

      <div className="progressContainer">
        <div className="progressHeader">
          <span>Progress:</span>
          <span className="progressPercent">
            {singleCourse.progress || 0}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={singleCourse.progress || 0}
          onChange={(e) => {
            const val = Number(e.target.value);
            setCourses((prev) =>
              prev.map((c) =>
                c._id === singleCourse._id ? { ...c, progress: val } : c
              )
            );
          }}
          onMouseUp={(e) => UpdateProgress(singleCourse._id, e.target.value)}
          onTouchEnd={(e) => UpdateProgress(singleCourse._id, e.target.value)}
          className="progressSlider"
          style={{ width: "100%", margin: "10px 0", cursor: "pointer" }}
        />
      </div>
    </div>
  ))
) : (
  <p>No courses found.</p>
)}
        </div>
        </div>
    )
}
export default Courses ;