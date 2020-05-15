import React from "react";
import {Link} from "react-router-dom";

export default class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showMenu: ""
        };
    }

    render(){
        const {firstname, lastname, clickHandler} = this.props;
        return (
            <div id="hamburgerPosition">
                <button id="hamburger" 
                    onClick={()=> {
                        this.setState({showMenu : "hamburger_menu_show"});
                    }}>
                </button>                
                <div id="hamburger_menu" className={this.state.showMenu}>
                    <Link to="/friends" onClick={() => {
                        this.setState({showMenu: "hamburger_menu_noshow"});
                    }}>
                        <img id="hamburger-menu-friends" src="../public/friends.png" />
                    </Link>
                    <div onClick={()=> {
                        clickHandler();
                        this.setState({showMenu: "hamburger_menu_noshow"});
                    }}
                    >Photo</div>                        
                    <Link to="/myself" className ="hamburgerLink" onClick={() => {
                        this.setState({showMenu: "hamburger_menu_noshow"});
                    }}>Profile</Link>
                    <Link to="/account" className ="hamburgerLink" onClick={() => {
                        this.setState({showMenu: "hamburger_menu_noshow"});
                    }}>Account</Link>
                    <h6 onClick={() => {
                        this.setState({showMenu: "hamburger_menu_noshow"});
                    }}>X</h6>
                </div>                
            </div>
        );        
    }
}