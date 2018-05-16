import React from 'react';
import validateResponse from "../util/validate-request";

class Token extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      token: '',
      isTokenRequested: false,
      isTokenValid: false,
    }
  }

  handleValidateClick = () =>
  {
    this.setState({isTokenRequested: true});

    fetch('https://api.moovly.com/user/v1/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      }
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(() => {
        this.setState({isTokenValid: true});
        window.setTimeout(() => this.props.handleSetToken(this.state.token, 250));
      })
      .catch(() => this.setState({isTokenValid: false}))
    ;
  };

  render()
  {
    return (
      <div className="step step-token">
        <h2>Your token</h2>
        <input type="text" onChange={(e) => this.setState({token: e.target.value})} value={this.state.token}/>
        <button onClick={this.handleValidateClick}>Validate</button>
        {this.state.isTokenValid && <span>Your token is valid.</span>}
      </div>
    )
  }
}

export default Token;