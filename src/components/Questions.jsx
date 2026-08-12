import {useState, useEffect } from "react";
import "../App.css"
import { useNavigate } from "react-router-dom"
import searchicon from "../assets/search-alt-2-svgrepo-com.svg"
import { useCallback } from "react";

function Questions(){
        const [questions , setQuestions] = useState([]);
        const [subject , setSubject] = useState('');
        const [content ,setContent] = useState('');
        const [showForm ,setShowForm] = useState(false);
        const [loading ,setLoading] = useState(false);
        const [restart ,setRestart] = useState(0);
        const [searchterm , setSearchterm] = useState("");
        const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    }
}, [navigate]);

        const LoadQuestions = useCallback(async (query = "") =>{
            try{
                const token = localStorage.getItem("token");
                setLoading(true);
                const data = await fetch(`study-hub-production-4e64.up.railway.app/api/questions?search=${encodeURIComponent(query)}`,{
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json"                    

                }});
                if(!data.ok){
                    console.log(data.message);
                    return;
                }
                const question = await data.json();
                setLoading(false);
                setQuestions(question)

            }catch(e){
                console.log(e);
            }
        },[])
        useEffect(()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect
            LoadQuestions(searchterm);
        },[LoadQuestions, restart, searchterm])

        const addQuestion = async(e)=>{
            e.preventDefault();
            const token = localStorage.getItem("token");
            if(!subject.trim() || !content.trim()) return;
            try{
                const respone = await fetch('study-hub-production-4e64.up.railway.app/api/questions',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                body: JSON.stringify({ subject , content }), 
      })

            if(respone.ok){
                const newQuestion = await respone.json();
                setQuestions((pre)=>[newQuestion, ...pre ]);
                setContent("");
                setSubject("");
                setShowForm(false);
                setRestart(prev => prev+1)
            }else{
                console.error("Failed to add Question")
            }
            }catch(e){
                console.log(e)
            }
        }
    const deleteOne = async(id)=>{
            try{
                const response = await fetch(`study-hub-production-4e64.up.railway.app/api/questions/${id}`, {
            method: 'delete', 
        });  
        if (response.ok){
            setQuestions((prev)=> prev.filter(question => question._id !== id))
            console.log("deleted successfully");
        } else {
            console.error("Failed to delete ");
        }
        }catch(e){
            console.log(e);
        }

        }
    return(
        <>
        <h1 className="pageTitle">Questions page</h1>
        <button className="addQuestionbtn" 
        onClick={()=>{ setShowForm(!showForm) 
        }}>{showForm ? "Cancel" : "+ Add Question "}
        
        </button>

        {showForm &&(
            <form onSubmit={addQuestion}>
                <h3>Create new Question</h3>
                <input className="inputForm"
            type="text"
            placeholder="Subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}               
                />
                <textarea
                placeholder="Write your Question here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
                />
                <button 
            type="submit" 
            className="formbtn"
            >Enter Question</button>
            </form>
        )}
                <span className="search">
                        <input  type="text" placeholder="Search..."
                        value={searchterm} 
                        onChange={(e)=> setSearchterm(e.target.value)}/>
                            <button className= "icon-btn img" type="button">
                                <img src={searchicon}/>
                            </button>
                    </span>  
 <div className="notes">
            { loading ? <p>LOADING....</p> : questions && questions.length>0 ? questions && questions.map((singleq)=>(
                <div className="noteCard" key={singleq._id}>
                    {
                    questions && questions.length > 0 ? <>
                    <h3 className="noteTitle">{singleq.subject}</h3>
                    <p className="noteContent">{singleq.content}</p>
                    <button
                    className="deletebtn"
                    onClick={()=>deleteOne(singleq._id)}
                    >DELETE</button>
                     </>
                    : <p>No Questions Yet</p> }
                </div>
            )): <p>No Questions Found</p>}
        </div>
        </>
    )
}
export default Questions ;