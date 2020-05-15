import React from "react";
import axios from "../axios.js";
import { Link } from 'react-router-dom';
import FriendButton from "./FriendButton.js";

export default class OtherProfile extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            error:false,
            otheruser:""
        };
    }

    componentDidMount(){
        const otherUserId = this.props.match.params.id;
        axios.get(`/otheruser/${otherUserId}`)
            .then( response => {
                if(response.data.success){
                    if(response.data.myself){
                        this.props.history.push("/myself");
                    } else {
                        this.setState({otheruser: response.data.otheruser});
                    }                    
                } else {
                    this.setState({error: true});
                }
            });
    }

    render(){
        const {error, otheruser} = this.state;
        if(error || !otheruser){
            return (
                <div id="Profile">
                    <div>
                        <div id="pictureScale">
                            <div className="userPhoto">
                                <div className="userPhotosubcirle">
                                    <img src="../public/logo.png"/>
                                </div>
                            </div>  
                        </div>                        
                        <div id="Bio">
                            <Link id="profileClose" className="link" to="/">X</Link>
                            <p>No profile</p>
                            <h1>No user found!</h1>                              
                        </div>                      
                    </div>                
                </div>
            );
        } else {
            return(
                <div id="Profile">
                    <div>
                        <div id="pictureScale">
                            {otheruser.profile_picture_url && 
                                <div className="userPhoto">
                                    <div className="userPhotosubcirle">
                                        <img src={otheruser.profile_picture_url}/>
                                    </div>
                                </div>}  
                            {!otheruser.profile_picture_url && 
                                <div className="userPhoto">
                                    <div className="userPhotosubcirle">
                                        <img src="../public/logo.png"/>
                                    </div>
                                </div>}
                        </div>                        
                        <div id="Bio">
                            <Link id="profileClose" className="link" to="/">X</Link>
                            <p>User profile</p>
                            <h1>{otheruser.firstname} {otheruser.lastname}</h1>  
                            <div className="flex" id="biofield">
                                <h2>Bio of {otheruser.firstname}:</h2>
                                {!otheruser.bio && <div>This user has shared no bio with us!</div> }
                                {otheruser.bio && <div>{otheruser.bio}</div> }
                            </div>  
                        </div>  
                        <FriendButton otherUserId={otheruser.id}/>                    
                    </div>                
                </div>
            );
        }        
    }
}