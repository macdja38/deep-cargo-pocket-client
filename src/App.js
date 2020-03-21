import React, { Component } from "react";
import "whatwg-fetch";
import { CSSReset, ThemeProvider, Box } from "@chakra-ui/core";

import Login from "./Components/Login";
import Panel from "./Components/Panel";
import { api } from "./consts";

class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = { user: null };
  }

  componentDidMount() {
    fetch(`${api}/user`, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(user => {
        this.setState({ user });
      })
      .catch(() => {});
  }

  render() {
    return (
      <ThemeProvider>
        <CSSReset />
        <Login user={this.state.user} />
        <Box maxWidth="60em" mx="auto">
          {this.state.user ? <Panel user={this.state.user} /> : ""}
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
