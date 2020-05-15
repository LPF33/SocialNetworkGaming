import React from 'react';
import axios from '../axios.js';
import { Link } from 'react-router-dom';

export default class ResetPasword extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            step: 1,
            email: "",
            code: "",
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
        axios.post("/password/reset", {
            email: this.state.email
        }).then(response => {

            if(response.data.success) {
                this.setState({step: 2});
            } else {
                this.setState({error: response.data.error});
            }


        }).catch(error => {
            this.setState({error: error.data.error});
        });
    }

    submit2(){
        axios.post("/password/reset/verify", {
            email: this.state.email,
            code: this.state.code,
            password: this.state.password
        }).then(response => {
            if(response.data.success) {
                this.setState({step: 3, error:""});
            } else {
                this.setState({error: response.data.error});
            }

        }).catch(error => {
            this.setState({error: error.data.error});
        });
    }


    render() {


        return (
            <div className="registration">
                <h1>Reset Password</h1>
               
                {this.state.error && <div className="error">{this.state.error}</div>}
               
                {this.state.step === 1 && 
                    <div className="reset">                    
                        <h4>Please enter your registered email address</h4>
                        <input onChange={e => this.updateInput(e)} type="email" name="email" placeholder="Your email" />
                        <input onClick={() => this.submit()} type="submit" value="Submit" />
                        <Link className="links" to="/login">Back to login</Link>
                    </div>
                }
                
                {this.state.step === 2 && 
                    <div className="reset">
                        <h4>Please enter the code you recieved</h4>
                        <input onChange={e => this.updateInput(e)} type="text" name="code" placeholder="code" />
                        <h4>Please enter a new password</h4>
                        <input onChange={e => this.updateInput(e)} type="password" name="password" placeholder="Your password" />
                        <input onClick={() => this.submit2()} type="submit" value="Submit" />
                    </div>
                }
    
                {this.state.step === 3 && 
                    <div className="reset">                   
                        <h2>Success!</h2>
                        <Link to="/login">You can now log in with your new password.</Link>
                    </div>
                }  
                
            </div>
        );
    }
}