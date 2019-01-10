import React, { Component } from "react";

class AuthPage extends Component {
  state = {
    isAuth: false,
    newUser: true
  };

  registerUser = () => {
    return (
      <div className="content-area">
        <h3>Register New User</h3>
        Email: <br />
        <input className="new-user-email" type="email" /> <br />
        Password: <br />
        <input className="new-user-password" type="password" /> <br />
        <button onClick={this.toggleNewUser}>Login Existing User</button>
      </div>
    );
  };

  loginUser = () => {
    return (
      <div className="content-area">
        <h3>Login User</h3>
        Email: <br />
        <input className="login-email" type="email" /> <br />
        Password: <br />
        <input className="login-password" type="password" /> <br />
        <button onClick={this.toggleNewUser}>Register New User</button>
      </div>
    );
  };

  toggleNewUser = () => {
    this.setState({
      newUser: !this.state.newUser
    });
  };

  render() {
    return (
      <div className="user-login">
        <h1>Auth Page</h1>
        {this.state.newUser ? this.registerUser() : this.loginUser()}
      </div>
    );
  }
}

export default AuthPage;
