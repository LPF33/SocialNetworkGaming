import React from "react";
import axios from "../axios";

export default class Uploader extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            file: null
        };
    }

    handleFileChange(e){
        this.setState({ 
            file : e.target.files[0]
        });
    }

    upload(){
        (async () => {
            if(this.state.file){
                
                if(this.props.UserPhoto){
                    const pictureFileURL = new URL(this.props.UserPhoto);
                    const pictureFile = pictureFileURL.pathname.slice(1);
                    await axios.get(`/user/photoS3delete/${pictureFile}`);
                }
                const formData = new FormData();
                formData.append("file", this.state.file);

                const response = await axios.post("/user/photo", formData);
                if(response.data.success){
                    this.props.userChangeHandler(response.data.user);
                }
            } 
        })();               
    }

    delete(){
        if(this.props.UserPhoto){
            const pictureFileURL = new URL(this.props.UserPhoto);
            const pictureFile = pictureFileURL.pathname.slice(1);
            axios.get(`/user/photo/delete/${pictureFile}`)
                .then(response => { 
                    if(response.data.success){
                        this.props.userChangeHandler(response.data.user);
                    }
                });
        }
        
    }

    render(){

        return (
            <div id="Uploader"> 
                <div id="UploaderX" onClick={ () => this.props.clickCloseHandler()}>X</div>
                <p>Upload your profile photo</p>
                <input type="file" onChange={e =>  this.handleFileChange(e)} />
                <button onClick={ () => {
                    this.upload();
                    this.props.clickCloseHandler();
                }}>Upload</button>
                <button id="deletePhoto" onClick={ () => {
                    this.delete();
                }}>Delete</button>
            </div>
        );
    }
}