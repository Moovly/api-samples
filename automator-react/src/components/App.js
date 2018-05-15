import React, { Component } from 'react';
import logo from '../static/logo.svg';
import '../styles/App.css';

class App extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      step: 0,
      token: '',
      isValid: false
    }
  }

  handleValidateClick = () =>
  {
    fetch('https://api.moovly.com/user/v1/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      }
    })
      .then(response => response.json())
      .then(response => {
        this.setState({isValid: true})
      })
      .catch(() => this.setState({isValid: false}))
    ;
  };

  render()
  {
    return (
      <div>
        <div>
          <h2>Your token</h2>
          <input type="text" onChange={(e) => this.setState({token: e.target.value})} value={this.state.token}/>
          <button onClick={this.handleValidateClick}>Validate</button>
          {this.state.isValid && <span>Your token is valid</span>}
        </div>
      </div>
    )
  }
}

export default App;
