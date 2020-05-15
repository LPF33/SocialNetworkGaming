import React from 'react';
import axios from '../axios.js';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            firstname : "",
            lastname : "",
            email: "",
            password: "",
            error: false
        };
    }

    updateInput(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submit(){
        axios.post("/register", {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password
        }).then(response => {

            if(response.data.success) {                
                location.replace("/");
            } else {
                this.setState({error: response.data.error});
            }


        }).catch(error => {
            console.log(error);
        });
    }

    render() {


        return (
            <div className="registration">
                <h1>Register</h1>
                {this.state.error && <div className="error">{this.state.error}</div>}
               
                <input onChange={e => this.updateInput(e)} type="text" name="firstname" placeholder="Your firstname" />
                <input onChange={e => this.updateInput(e)} type="text" name="lastname" placeholder="Your lastname" />
                <input onChange={e => this.updateInput(e)} type="email" name="email" placeholder="Your email" />
                <input onChange={e => this.updateInput(e)} onKeyDown={e => {if(e.key == "Enter"){this.submit();}}} type="password" name="password" placeholder="Your password" />
        
                <input onClick={() => this.submit()} type="submit" value="Register" />
                <Link className="links" to="/login">Click here to Log in!</Link>
            </div>
        );
    }
}