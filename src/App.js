import React, { Component } from 'react';
import './App.css';
import 'whatwg-fetch';
import Login from './Components/Login'
import Panel from './Components/Panel';
import {api} from './consts';

class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = {user: null};
  }

  componentDidMount() {
    fetch(`${api}/user`, {
      credentials: 'include'
    }).then((response) => response.json()).then((user) => {
      console.log("got user", user);
      this.setState({user})
    })
  }

  render() {
    return (
      <div className="App">
        <Login user={this.state.user} />
        {this.state.user ? <Panel user={this.state.user} />: ""}
      </div>
    );
  }
}

export default App;
