import React, { Component } from 'react';
import Navbar from './navbar';

class Navbar extends Component {
    state = {  } 
    render() { 
        return <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="#">Navbar</a>
            </div>
      </nav>
    }
}
 
export default Navbar ;