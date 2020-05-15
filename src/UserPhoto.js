import React from "react";

export default class UserPhoto extends React.Component {

    render(){
        const {UserPhoto} = this.props;

        if(UserPhoto){
            return(
                <div className="userPhoto" onClick={ () => this.props.clickHandler()}>
                    <div className="userPhotosubcirle">
                        <img src={UserPhoto}/>
                    </div>
                </div>
            );
        } else {
            return(
                <div className="userPhoto" onClick={ () => this.props.clickHandler()}>
                    <div className="userPhotosubcirle">
                        <img src="./public/logo.png"/>
                    </div>
                </div>
            );
        }
    }

}