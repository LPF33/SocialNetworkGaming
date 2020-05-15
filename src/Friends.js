import React, {useEffect} from "react";
import {loadFriends, unfriend, accept} from "./actions";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

export default function Friends(props){

    const dispatch = useDispatch();

    const friends = useSelector(state => {
        if(state.loadfriends){
            return state.loadfriends.filter(friend => friend.accepted == true);
        }
    });

    const wannebes = useSelector(state => {
        if(state.loadfriends){
            return state.loadfriends.filter(wannebe => wannebe.accepted == false);
        }
    });

    useEffect(() => {
        dispatch(loadFriends());
    }, []);

    return (
        <div id="friends">
            <Link id="closefriends" to="/">X</Link>          
            {!friends && 
                <div className="friends" id="nofriends">
                    <img  src="../public/logo.png" />
                    <div className="friendsDiv">
                        <p>No</p>
                        <p>Friends</p> 
                        <Link to="/" id="nofriendsLink">👀 Search? </Link>
                    </div> 
                </div>}
            {friends && friends.length>0 &&
                <div id="myfriends"> 
                    <div> 
                        <div className="friendsDiv">   
                            <p>Your</p>
                            <p>friends:</p> 
                        </div>
                    </div>
                    {friends.map(friend =>
                        <div key={friend.id}  className="friends">
                            <Link to={'/userprofile/'+friend.id}><img  src={friend.profile_picture_url}/></Link>
                            <div className="friendsDiv">
                                <p>{friend.firstname}</p>
                                <p>{friend.lastname}</p> 
                                <button onClick={() => dispatch(unfriend(friend.id))}>&#128532; Unfriend? </button>
                            </div>                            
                        </div>
                    )}
                </div>
            }
            {wannebes && wannebes.length>0 &&
                <div id="wannebes"> 
                    <div> 
                        <div className="wannebesDiv">   
                            <p>Your</p>
                            <p>friend</p>
                            <p>requests:</p> 
                        </div>
                    </div>
                    {wannebes.map(wannebe => 
                        <div key={wannebe.id}  className="wannebes">
                            <Link to={'/userprofile/'+wannebe.id}><img  src={wannebe.profile_picture_url}/></Link>
                            <div className="wannebesDiv">
                                <p>{wannebe.firstname}</p>
                                <p>{wannebe.lastname}</p> 
                                <button onClick={() => dispatch(accept(wannebe.id))}>Accept</button>
                            </div>                            
                        </div>
                    )}
                </div>
            }
        </div>
    );
}