import React, {useState, useEffect} from "react";
import axios from "../axios.js";
import {Link} from "react-router-dom";

export default function UserSearch(){
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {

        let ignore = false;

        (async () => {
            const result = await axios.get("/users/", {params: {search: query}});
            if(!ignore && result.data.success){ 
                setUsers(result.data.users);
            }                                 
        })();

        return () => {
            ignore = true;
        };         

    },[query]);

    return(
        <div id="searchUser" >
            <img src="../public/magnifier.png" id="magnifier"/>
            <input className="searchUserInput"
                onClick={ () => setVisible(true)}
                onChange={ e => setQuery(e.target.value)}
                placeholder="Search for opponents"
                type="text"
                name="query"  
                value = {query}                             
            /> 
            {visible && <button onClick={()=> {setVisible(false); setQuery("");}}>X</button>}
            {users.length>0 && visible &&
                <div className="searchUserOutput">
                    <ul>
                        {users.map(user => <li key={user.id} className="searchProfile">
                            <Link to={`/userprofile/`+user.id} className="searchlink">
                                {user.profile_picture_url && <img src={user.profile_picture_url}/>}
                                {!user.profile_picture_url && <img src="../public/logo.png"/>}                                  
                                <p>{user.firstname} {user.lastname}</p>
                            </Link>
                        </li>)}
                    </ul>
                    
                </div> 
            }  
            {!users.length && visible && <div id="nosearch">No users found for {query}</div>}   
        </div>
    );
}