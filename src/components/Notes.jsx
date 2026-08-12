import "../App.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import searchicon from "../assets/search-alt-2-svgrepo-com.svg"
import { useCallback } from "react";
function Notes(){
    const [notes , setNotes] = useState([]);
    const [title , setTitle] = useState('');
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
    const LoadNotes =useCallback(async( query = "")=>{
        try{
            const token = localStorage.getItem("token");
            setLoading(true);
            const data = await fetch(`study-hub-production-4e64.up.railway.app/api/notes?search=${encodeURIComponent(query)}`,{
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  }
});
            if (!data.ok){
                console.log(data.message)
                return;
            }
         const note = await data.json();
            setLoading(false);
            setNotes(note)
        }catch(error){
            console.log(error)
  
        }
    },[]);
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        LoadNotes(searchterm);
        
    },[LoadNotes, restart, searchterm])
    const addNote = async (e)=>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!title.trim()||!content.trim()) return;
        try{
        const response = await fetch('study-hub-production-4e64.up.railway.app/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }), 
      });
      if(response.ok){
        const newNote = await response.json();
        setNotes((pre)=>[newNote,...pre])
        setTitle("");
        setContent("");
        setShowForm(false);
        setRestart(prev => prev+1)
        
      }else{
        console.error("Failed to add note")
      }

        }catch(error){
            console.log(error)
  
        }
    }
    const deleteAll = async()=>{
    try {
        const response = await fetch('study-hub-production-4e64.up.railway.app/api/notes', {
            method: 'delete', 
        });

        if (response.ok) {
            setNotes([]);
            console.log("All notes deleted successfully");
        } else {
            console.error("Failed to delete all notes");
        }
    } catch (error) {
        console.log("Error deleting notes:", error);
    }
};
    const deleteNote = async(id)=>{
        try{
             const response = await fetch(`study-hub-production-4e64.up.railway.app/api/notes/${id}`, {
            method: 'delete', 
        });            
        if(response.ok){
            setNotes((prev)=>prev.filter(note => note._id !== id))
            console.log("deleted successfully");
        } else {
            console.error("Failed to delete note");
        }
    } catch (error) {
        console.log("Error deleting notes:", error);
    }
        }
    
        

    

    return(
        <>
        <h1 className="pageTitle">Note page </h1>


        <button className='addNote' 
        onClick={()=>{ setShowForm(!showForm) 
        }}>{showForm ? "Cancel" : "+ ADD NOTE"}</button>

        {showForm &&(
            <form onSubmit={addNote}>
                <h3>Create new Note</h3>
                <input
                className="inputform"
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}          
                />
                <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"/>
                <button className="formbtn"
            type="submit"           
          >Save Note</button>
            </form>
        )}

        <button className='addNote' onClick={deleteAll}>Delete All</button>
        <span className="search">
                <input  type="text" placeholder="Search..."
                value={searchterm} 
                onChange={(e)=> setSearchterm(e.target.value)}/>
                    <button className= "icon-btn img" type="button">
                        <img src={searchicon}/>
                    </button>
            </span>   

        <div className="notes">
            { loading ? (<p>LOADING....</p> ) : notes && notes.length > 0 ? notes && notes.map((singleNote)=>(
                <div className="noteCard" key={singleNote._id}>
                    {
                     <>
                    <h3 className="noteTitle">{singleNote.title}</h3>
                    <p className="noteContent">{singleNote.content}</p>
                    <button
                    onClick={()=>deleteNote(singleNote._id)}
                    className="deletebtn"
                    >DELETE</button> 
                     </>
                    }
                </div>
            )):<p>No Notes Found.</p>}
        </div>
        </>
    )
}
export default Notes ;