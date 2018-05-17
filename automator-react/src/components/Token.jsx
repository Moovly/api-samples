import React from "react";
import validateResponse from "../util/validate-request";

export default class Token extends React.Component {
  state = {
    token: this.props.token || "",
    isTokenRequested: false,
    isTokenValid: false
  };

  componentDidMount = () => {
    this.handleValidateToken();
  };

  handleValidateToken = () => {
    this.setState({ isTokenRequested: true });

    fetch("https://api.moovly.com/user/v1/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.state.token}`
      }
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(() => {
        this.setState({ isTokenValid: true });
        // why timeout needed?
        window.setTimeout(() => this.props.handleSetToken(this.state.token, true, 250));
      })
      .catch(() => this.setState({ isTokenValid: false }));
  };

  onChange = (e) => {
    this.setState({ token: e.target.value})
  }

  render() {
    if (this.props.isHidden) return null;

    return (
      <div className={`step step-token ${this.props.isDone ? "step-done" : ""}`}>
        <div className="step__info">
          <h2>Your token</h2>
        </div>

        <div className="step__action">
          <input type="text" onChange={this.onChange} value={this.state.token} />
          <button onClick={this.handleValidateToken}>Validate</button>
          {this.state.isTokenValid && <div className="alert alert-info">Your token is valid.</div>}
        </div>
      </div>
    );
  }
}
