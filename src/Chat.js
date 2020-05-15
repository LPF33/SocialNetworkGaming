import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {socket} from "./sockets.js";

function Message(props){
    const {firstname,lastname, profile_picture_url, message_text} = props;
    
    const userPhoto = profile_picture_url ? <img src={profile_picture_url}/> : <img src="../public/logo.png"/>;

    return (
        <div className="singleMessage">
            {userPhoto}
            <div className="singleMessageTN">                
                <div className="singleMessageName">{firstname} {lastname}</div> 
                <p className="singleMessageText">{message_text}</p>
            </div>                       
        </div>
    );
}

export default function Chat(){

    const messages = useSelector((state) => state.allMessages);
    const [messageDraft, setMessageDraft] = useState("");

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop = 100000;
    },[messages]);

    function handleClick(){
        socket.emit("chatMessage", messageDraft);
        setMessageDraft("");
    }    

    return(
        <div id="networkChat">
            <div className="networkOutput" ref={elemRef}>
                {messages && 
                    messages.map((message) => 
                        <Message key={message.chat_id} {...message} />
                    )}
            </div>        
            <div className="networkInput">
                <input type="text" 
                    value={messageDraft} 
                    placeholder="Type a message"
                    onChange={e => setMessageDraft(e.target.value)}
                    onKeyDown={e => {
                        if(e.key == "Enter"){
                            handleClick();
                        }
                    }}
                />
                <button onClick={handleClick}>Send</button>
            </div>
        </div>
    );
}