import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css"

import "./index.css";
import Chat from './Chat'

const App = () => {

    return (
        <div className="container">
            <div className="row" id="title-row">
                <h1 id="title">Anonymous Chatroom</h1>
            </div>
            <Chat />
        </div>
    )

}

ReactDOM.render(<App />, document.getElementById("app"));
