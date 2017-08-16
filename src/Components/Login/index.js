import React, {Component} from 'react';
import PropTypes from 'proptypes'

class Login extends Component {
  render() {
    if (this.props.user) {
      return (<div>
        Logged in as: {decodeURIComponent(this.props.user.username)}
      </div>)
    }
    return (
      <button onClick={() => window.location.href = "http://127.0.0.1:3001/login"}>
        Login
      </button>
    );
  }
}

Login.props = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

export default Login;
