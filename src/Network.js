import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {getAllUsersOnline, getAllFriendsOnline} from "./actions.js";
import {socket} from "./sockets.js";

function PlayChat(props){
    const {user_id,firstname,lastname, profile_picture_url} = props;
    const [onMouse, setOnMouse] = useState(false);

    function invitePlay(id){
        socket.emit("gameInvitation", id);
    }

    function inviteChat(id){
        socket.emit("chatInvitation", id);
    }

    return (
        <div className="singleUserOnline" onMouseOver={() => setOnMouse(true)} onMouseLeave={() => setOnMouse(false)}>
            {onMouse &&
            <div>
                <button className="singlePlayRequest" onClick={() => invitePlay(user_id)}></button>
                <button className="singleChatRequest" onClick={() => inviteChat(user_id)}></button>
            </div>}            
            <Link to={`/userprofile/${user_id}`} className="allOnlineUsersLink"><img className="allOnlineUsersImg" src={profile_picture_url}/></Link>
            <h4>{firstname} {lastname}</h4>
        </div>
    );
}

export default function Network(){

    const usersOnline = useSelector((state) => state.allUsersOnline || []);
    const friendsOnline = useSelector((state) => state.allFriendsOnline || []);
    const chatInvitations = useSelector((state) => state.allChatInvitations);
    const gameInvitations = useSelector((state) => state.allGameInvitations);
    const dispatch = useDispatch();

    const [mainChatVisible, setMainChatVisible] = useState(false);
    const [visibleOnline, setVisibleOnline] = useState(false);
    const [visibleOnlineFriends, setVisibleOnlineFriends] = useState(false);
    const [playRequests, setplayRequests] = useState(false);
    const [chatRequests, setchatRequests] = useState(false);

    useEffect(() => {
        dispatch(getAllUsersOnline());
        dispatch(getAllFriendsOnline());
    },[]);

    return(
        <div id="networkMenu">
            <div className="allOnlineUser">
                {!friendsOnline.length && <h3>No friends online</h3>}
                {friendsOnline.length>0 && <h3>Friends</h3>}
                {friendsOnline.length>0 && 
                <div>
                    {!visibleOnlineFriends && 
                    <div className="mainChatButton" onClick={()=>setVisibleOnlineFriends(true)}>?</div>}
                    {visibleOnlineFriends && 
                    <div className="mainChatButtonX" onClick={()=>setVisibleOnlineFriends(false)}>X</div>}
                </div>
                }
                <div id="allFriendsGrid">
                    {friendsOnline.length>0 && 
                        friendsOnline.map(friend => 
                            <Link key={friend.user_id} to={`/userprofile/${friend.user_id}`} className="allOnlineUsersLink">
                                {friend.profile_picture_url && <img className="allOnlineUsersImg" src={friend.profile_picture_url}/>}
                                {!friend.profile_picture_url && <img className="allOnlineUsersImg" src="../public/backgroundRabbit.gif"/>}
                            </Link>
                        )
                    }
                </div>
                <div>
                    {!playRequests && 
                    <Link className="invitationButton" to="/GameInvitations" onClick={()=>setplayRequests(true)}>
                        <img src="../public/dice.png"/>
                        {!gameInvitations && <div className="invitationPlayNumber">0</div>}
                        {gameInvitations && <div className="invitationPlayNumber">{gameInvitations.length}</div>}
                    </Link>}
                    {playRequests && 
                    <Link className="mainChatButtonX" to="/" onClick={()=>setplayRequests(false)}>X</Link>}
                </div>
                <div>
                    {!chatRequests && 
                    <Link className="invitationButton" to="/ChatInvitations" onClick={()=>setchatRequests(true)}>
                        <img src="../public/chat.png"/>
                        {!chatInvitations && <div className="invitationChatNumber">0</div>}
                        {chatInvitations && <div className="invitationChatNumber">{chatInvitations.length}</div>}
                    </Link>}
                    {chatRequests && 
                    <Link className="mainChatButtonX" to="/" onClick={()=>setchatRequests(false)}>X</Link>}
                </div>
            </div>

            {visibleOnlineFriends && 
            <div className="viewAllNetwork">
                <div>
                    {friendsOnline && friendsOnline.map(friend => <PlayChat key={friend.user_id} {...friend}/>)}
                </div>
            </div>} 
            
            <div className="allOnlineUser">
                {usersOnline.length>0 && <h3>Users</h3>}
                {!usersOnline.length && <h3>No users online</h3>}
                {usersOnline.length>0 &&
                <div>
                    {!visibleOnline && 
                    <div className="mainChatButton" onClick={()=>setVisibleOnline(true)}>?</div>}
                    {visibleOnline && 
                    <div className="mainChatButtonX" onClick={()=>setVisibleOnline(false)}>X</div>}
                </div>
                }
                <div id="allUsersGrid">
                    {usersOnline.length>0 && 
                        usersOnline.map(user => 
                            <Link key={user.user_id} to={`/userprofile/${user.user_id}`} className="allOnlineUsersLink">
                                {user.profile_picture_url && <img className="allOnlineUsersImg" src={user.profile_picture_url}/>}
                                {!user.profile_picture_url && <img className="allOnlineUsersImg" src="../public/backgroundRabbit.gif"/>}
                            </Link>
                        )
                    }
                </div>
                <div>
                    {!mainChatVisible && 
                    <Link className="mainChatButton" to="/NetworkChat" onClick={()=>setMainChatVisible(true)}><img src="../public/chat.png"/></Link>}
                    {mainChatVisible && 
                    <Link className="mainChatButtonX" to="/" onClick={()=>setMainChatVisible(false)}>X</Link>}
                </div>
            </div>
            {visibleOnline && 
            <div className="viewAllNetwork">
                <div>
                    {usersOnline && usersOnline.map(user => <PlayChat key={user.user_id} {...user}/>)}
                </div>
            </div>}            
        </div>
    );
}

                     