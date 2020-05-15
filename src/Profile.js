import React from "react";
import BioEditor from "./BioEditor.js";
import {Link} from "react-router-dom";

export default class Profile extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        const {firstname, lastname, bio, updateBio, userPhotoComponent} = this.props;
        return(
            <div id="Profile">
                <div>
                    <div id="pictureScale">
                        {userPhotoComponent}  
                    </div>                        
                    <div id="Bio">
                        <Link id="profileClose" className="link" to="/">X</Link>
                        <p>Your profile</p>
                        <h1>{firstname} {lastname}</h1>  
                        <BioEditor 
                            bio = {bio}
                            updateBio = {updateBio}
                        />
                    </div>                      
                </div>                
            </div>
        );
    }
}