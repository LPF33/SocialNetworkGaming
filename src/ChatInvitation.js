import React, {useState, useEffect, useRef} from "react";
import {useSelector,useDispatch} from "react-redux";
import {socket} from "./sockets.js";
import {acceptInvitationTrue, declineChatInvitation} from "./actions.js";

function Message(props){
    const {firstname,messageDraft} = props;       
    
    return (        
        <div className="singleMessageTN">                
            <div className="singleMessageName">{firstname}</div> 
            <p className="singleMessageText">{messageDraft}</p>
        </div> 
    );
}

function ChatModule(props){

    const {firstname,invitation, index} = props;
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.RoomMessages);
    const [chatButtonVisible, setChatButtonVisible] = useState(false);
    const [chatVisible, setChatVisible] = useState(false);
    const [messageDraft, setMessageDraft] = useState("");
        

    const elemRef = useRef();
/*
    useEffect(() => {
        if(messages){
            elemRef.current.scrollTop = 100000;
        }        
    },[messages]);*/

    function handleClick(){
        socket.emit("singleChatMessage", {firstname, messageDraft, room:invitation.room});
        setMessageDraft("");
    } 

    function acceptChat(host, index){
        dispatch(acceptInvitationTrue(index));
        socket.emit("acceptChat", {host, room:invitation.room});
    }

    function declineChat(host, index){
        dispatch(declineChatInvitation(index));
        socket.emit("declineChat", { firstname, room:invitation.room});
    }

    return(
        <div className="singleChatInvitation" onBlur={() => setChatVisible(false)} onFocus={() => setChatVisible(true)}>
            <p>{invitation.message}</p>
            <p className="singleChatHost">- from {invitation.host.firstname} {invitation.host.lastname}</p>
            <div className="singleChatFlex">
                {!invitation.decline && !invitation.accept && !chatButtonVisible && <button onClick={() => {setChatButtonVisible(true); acceptChat(invitation.host.id, index);}} className="singleChatButton">Accept</button>}
                {!invitation.decline && !invitation.accept && !chatButtonVisible && <button onClick={() => declineChat(invitation.host.id, index)} className="singleChatButton">Decline</button>}
            </div>
            
            <div>
                {!invitation.decline && (invitation.accept || chatButtonVisible) && !chatVisible && <button onClick={() => setChatVisible(true)} className="singleChatButton">Chat</button>}
                {!invitation.decline && (invitation.accept || chatButtonVisible) && chatVisible && <button onClick={() => setChatVisible(false)} className="singleChatButton">X</button>}
            </div>
            
            
            {chatVisible &&
                <div className="singleChatOutput">
                    <div className="singleChatOutputfield" ref={elemRef}>
                        {messages && 
                        messages.filter(message=>message.room===invitation.room).map((message, index) => 
                            <Message key={index} {...message}/>
                        )}
                    </div>
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
                    <button onClick={handleClick} className="singleChatButton">Send</button>
                </div>
            }  
        </div>
    );
}

export default function ChatInvitation(props){
    const {firstname} = props;

    const ChatInvitations = useSelector(state => state.allChatInvitations);  

    return(
        <div>
            {!ChatInvitations && <div className="chatInvitationModal">You have no invitation to a chatroom!</div>}
            
            {ChatInvitations &&
            <div className="chatInvitationModal">
                {ChatInvitations.map((invitation, index) => 
                    <ChatModule key={index} invitation={invitation} firstname={firstname} index={index}/>
                )}
            </div>                          
            }
        </div>
    );
}