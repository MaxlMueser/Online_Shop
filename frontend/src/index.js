import React from "react";
import ReactDOM from "react-dom";
import navbar from "./navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import Product from "./product";
import App from "./app";

const element = <h1>Hello, world!</h1>;
const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(<App />);