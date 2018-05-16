import React, { Component } from 'react';
import '../styles/App.css';
import Token from "./Token";
import Templates from "./Templates";
import Form from "./Form";
import Poller from "./Poller";
import 'url-search-params-polyfill';
import Theme from "./Theme";

class App extends Component
{
  parameters = null;

  constructor(props)
  {
    super(props);

    this.parameters = new URLSearchParams(window.location.search);

    this.state = {
      token: this.getTokenFromUrl(),
      isTokenValid: false,
      templateId: null,
      variables: null,
      jobId: null,
    }
  }

  getTokenFromUrl = () =>
  {
    return this.parameters.get('token') || null;
  };

  isTokenFormHidden = () =>
  {
    return this.parameters.get('token_hidden') === "1" || false;
  };

  handleSetToken = (token, valid) =>
  {
    this.setState({token: token, isTokenValid: valid});
  };

  handleSetTemplate = (templateId, variables) =>
  {
    this.setState({templateId: templateId, variables: variables});
  };

  handleSetValues = (values) =>
  {
    this.setState({values: values});
  };

  handleSetJobId = (jobId) =>
  {
    this.setState({jobId: jobId});
  };

  actions = {
    handleSetToken: this.handleSetToken,
    handleSetTemplate: this.handleSetTemplate,
    handleSetValues: this.handleSetValues,
    handleSetJobId: this.handleSetJobId
  };

  getStep = () => {
    if (this.state.token === null || !this.state.isTokenValid) {
      return 0;
    }

    if (this.state.templateId === null || this.state.variables === null) {
      return 1;
    }

    if (this.state.jobId === null) {
      return 2;
    }

    return 3;
  };

  render()
  {
    const step = this.getStep();

    return (
      <Theme>
        <Token {...this.state} {...this.actions} isDone={step >= 1} isHidden={this.isTokenFormHidden()}/>
        {step >= 1 && <Templates {...this.state} {...this.actions} isDone={step >= 2}/>}
        {step >= 2 && <Form {...this.state} {...this.actions} isDone={step >= 3}/>}
        {step >= 3 && <Poller {...this.state} {...this.actions} />}
      </Theme>
    )
  }
}

export default App;
