import React, {useState, useEffect} from "react";
import axios from "../axios.js";

export default function FriendButton(props){

    const status_NoRequest = "no-request";
    const status_Request_Accepted = "request-accepted";
    const status_Request_MadeByOther = "request-made-by-other";
    const status_Request_MadeByMe = "request-made-by-myself";

    const {otherUserId} = props;
    const [status,setStatus] = useState("no-request");

    useEffect( () => {
        (async () => {
            const newStatus = await axios.get(`/checkfriendstatus/${otherUserId}`);
            setStatus(newStatus.data.status);
        })();
    });

    function sendRequest(){
        (async () => {
            const newStatus = await axios.post(`/crudfriendstatus/${otherUserId}/${status}`);
            setStatus(newStatus.data.status);
        })();
    }
 
    if(status == status_NoRequest){
        return(
            <button id="friendRequest" onClick={sendRequest}>&#128540; Friends?</button>
        );
    } else if(status == status_Request_Accepted){
        return(
            <button id="friendRequest" onClick={sendRequest}>&#128532; Over? <s>Friends</s></button>
        );
    } else if(status == status_Request_MadeByMe){
        return(
            <button id="friendRequest" onClick={sendRequest}>&#128548; Cancel</button>
        );
    } else if(status == status_Request_MadeByOther){
        return(
            <button id="friendRequest" onClick={sendRequest}>&#128516; Accept</button>
        );
    }
} 