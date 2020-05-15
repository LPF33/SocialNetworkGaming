import React from "react";
import axios from "../axios.js";

export default class Bioeditor extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            addBio: false,
            draft: this.props.bio
        };        
    }

    saveBio(){
        axios.post("/user/bio", {bio : this.state.draft})
            .then(result =>{
                this.props.updateBio(result.data.user);
            });
    }

    editBio(){
        return(
            <div className="flex">
                <textarea onChange={e => this.setState({draft: e.target.value})} defaultValue={this.props.bio} maxLength="200"></textarea>
                <button className="biobutton" onClick={() => {
                    this.saveBio();
                    this.setState({addBio:false});
                }}>Save</button>
            </div>
        );        
    }

    render(){
        const {bio} = this.props;

        if(bio){
            return(
                <div className="flex" id="biofield">
                    <h2>Your Bio:</h2>
                    {!this.state.addBio && <div>{bio}</div>}
                    {!this.state.addBio && <button className="biobutton" onClick={
                        () => this.setState({addBio: true})
                    }>Edit</button>}                    
                    {this.state.addBio && this.editBio()}
                </div>                
            );
        } else {
            return(
                <div className="flex" id="biofield">
                    <h2>Bio</h2>
                    <div>Just share some fun facts with us!</div>
                    {!this.state.addBio && <button  className="biobutton" onClick={
                        () => {
                            this.setState({addBio: true});
                            this.setState({draft:this.props.bio});                  
                        }}>Add</button>}  
                    {this.state.addBio && this.editBio()}
                </div>                
            );
        }        
    }
}