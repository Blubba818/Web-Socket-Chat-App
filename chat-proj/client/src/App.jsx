import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css"

import "./index.css";
import Chat from './Chat'

const App = () => <Chat />;

ReactDOM.render(<App />, document.getElementById("app"));
