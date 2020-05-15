import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './Registration.js';
import Login from './Login.js';
import ResetPassword from './Resetpassword';
import App from './App';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxPromise from "redux-promise";
import reducer from "./reducers.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import {init} from "./sockets.js";
init(store);

function Welcome() {
    return (              
        <div className="welcome">
            <div className="headline">
                <div className="headlinesubcirle">
                    <h1>F<img src="/public/logo.png"/>n.js</h1>
                    <p>&lt;Coding&gt;</p>
                    <p>#Games.lpf</p>
                </div>
            </div>  
            <HashRouter>
                <div className="innerwelcome">
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}

const showWelcomePage = (window.location.pathname === '/welcome');

if(showWelcomePage){
    ReactDOM.render(
        <Welcome />,
        document.querySelector("main")
    );
}else{
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.querySelector("main")
    );
}