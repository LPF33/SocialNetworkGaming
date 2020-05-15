import React from 'react';
import axios from '../axios.js';
import UserPhoto from "./UserPhoto.js";
import Uploader from "./Uploader.js";
import Menu from "./Menu.js";
import Games from "./Games.js";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile.js";
import SearchUser from "./SearchUser.js";
import Friends from "./Friends.js";
import Chat from "./Chat.js";
import Account from "./Account.js";
import Network from "./Network.js";
import ChatInvitation from "./ChatInvitation.js";
import {BrowserRouter, Route} from "react-router-dom";

export default class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: null,
            uploaderVisible: false,
            showIframe:null
        };
    }

    componentDidMount(){
        axios.get("/user").then(response => {
            this.setState({
                user: response.data.user
            });
        });
    }

    render(){
        if(!this.state.user){
            return (<div>Welcome</div>);
        }
        const {firstname, lastname, bio, profile_picture_url} = this.state.user;
        return (
            <div className="innerwelcome loginchange">
                <p className="welcomeLogin">Welcome, {firstname}</p>

                <div className="mainpage showmainpage">
                    <BrowserRouter>
                        <Route
                            exact path="/userprofile/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            exact path="/myself"
                            render={() => (
                                <Profile
                                    firstname = {firstname}
                                    lastname = {lastname}
                                    bio = {bio} 
                                    updateBio = { user =>
                                        this.setState({user})
                                    } 
                                    userPhotoComponent = {<UserPhoto 
                                        UserPhoto = {profile_picture_url}
                                        clickHandler = { () => 
                                            this.setState({uploaderVisible: true})
                                        }   
                                        clickCloseHandler={ () => 
                                            this.setState({ uploaderVisible: false })
                                        }  
                                    />}
                                />
                            )}
                        />
                    
                        <Menu 
                            clickHandler = { () => 
                                this.setState({uploaderVisible: true})
                            }  
                        />
                        <SearchUser />
                        <Route 
                            exact path = "/friends"
                            component={Friends}
                        />
                        <Route 
                            exact path = "/NetworkChat" 
                            component={Chat} 
                        />
                        <Route 
                            exact path = "/account"
                            render={() => <Account 
                                firstname={firstname} 
                                lastname={lastname} 
                                profile_picture_url={profile_picture_url}
                                updateBio = { user =>
                                    this.setState({user})}/>}
                        />
                        <Network />
                        <Route 
                            exact path = "/ChatInvitations"
                            render={ () => <ChatInvitation
                                firstname={firstname} />
                            }
                        />
                        <a id="logout" href="/logout"></a>
                    </BrowserRouter>                    
                    <UserPhoto 
                        UserPhoto = {profile_picture_url}
                        clickHandler = { () => 
                            this.setState({uploaderVisible: true})
                        }   
                        clickCloseHandler={ () => 
                            this.setState({ uploaderVisible: false })
                        }                    
                    />
                    {this.state.uploaderVisible && 
                    <Uploader 
                        UserPhoto = {profile_picture_url}
                        userChangeHandler={ user =>
                            this.setState({ user, uploaderVisible: false })
                        }
                        clickCloseHandler={ () => 
                            this.setState({ uploaderVisible: false })
                        } 
                    />}
                    <Games 
                        ClickToPlay={game => this.setState({showIframe:game})}
                    />
                    {this.state.showIframe && <iframe src={`/games/${this.state.showIframe}/`} ></iframe>}
                    {this.state.showIframe && <div id="iframeX" onClick={() => this.setState({showIframe:null})}>X</div>}
                </div>
            </div>
        ); 
    }
    
}