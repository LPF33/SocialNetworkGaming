import React from 'react';
import axios from '../axios.js';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
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
        axios.post("/login", {
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
                <h1>Login</h1>
                {this.state.error && <div className="error">{this.state.error}</div>}

                <input onChange={e => this.updateInput(e)} type="email" name="email" placeholder="Your email" />
                <input onChange={e => this.updateInput(e)} onKeyDown={e => {if(e.key == "Enter"){this.submit();}}} type="password" name="password" placeholder="Your password" />
        
                <input onClick={() => this.submit()}  type="submit" value="Login" />
                <Link className="links" to="/">Not registered? Click here!</Link>
                <Link className="links" to="/resetpassword">Forgot your password?</Link>
            </div>
        );
    }

}