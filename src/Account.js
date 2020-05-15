import React, {useState} from "react";
import {Link} from "react-router-dom";
import axios from "../axios.js";

export default function Account(props){

    const {firstname,lastname, updateBio, profile_picture_url} = props;
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [visibleName, setVisibleName] = useState(false);
    const [newFirstName, setFirstName] = useState(firstname);
    const [newLastName, setLastName] = useState(lastname);
    const [output, setOutput] = useState("");

    const pictureFileURL = new URL(profile_picture_url);
    const pictureFile = pictureFileURL.pathname.slice(1);

    async function saveNewName(){
        if(!newFirstName || !newLastName){
            setVisibleName(true);
            setOutput("Please, fill out all fields!");
        } else {
            let user ;
            try {
                user =  await axios.post("/edit/account", {firstname: newFirstName, lastname:newLastName});
            } catch (error){
                setVisibleName(true);
                setOutput("Something went wrong");
            }
            setVisibleName(true);
            setOutput("Your changes are saved!");
            updateBio(user.data.user);
        }
    }

    return(
        <div id="Account" >                       
            <div>
                <Link id="profileClose" className="link" to="/">X</Link>             
                <h1>Account Settings:</h1>
                {visibleName && <h3>{output}</h3>}
                <div className="accountName">
                    <div className="accountName2">
                        <input type="text" placeholder="firstname" value={newFirstName} onChange={e => setFirstName(e.target.value)}/>
                        <input type="text" placeholder="lastname" value={newLastName} onChange={e => setLastName(e.target.value)}/>
                    </div>
                    <div id="accountDelete"><button onClick={saveNewName}>Save</button></div>
                </div>                
                <h1>Delete your Account</h1>
                {!visibleDelete && <div id="accountDelete"><button  onClick={()=> setVisibleDelete(true)}>Delete</button></div>}
                {visibleDelete && 
                <div id="accountDelete">
                    <h2>Are you sure?</h2>
                    <div>                        
                        <a className="deletelink" href={`/account/delete/${pictureFile}`}>YES</a>
                        <button onClick={()=>setVisibleDelete(false)}>NO</button>
                    </div>
                </div>}
            </div>                 
        </div>
    );
}