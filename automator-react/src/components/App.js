import React, { Component } from 'react';
import '../styles/App.css';
import Token from "./Token";
import Templates from "./Templates";
import Form from "./Form";
import Poller from "./Poller";

class App extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      token: null,
      templateId: null,
      variables: null,
      jobId: null,
    }
  }

  handleSetToken = (token) =>
  {
    this.setState({token: token});
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
    if (this.state.token === null) {
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
      <div>
        {step === 0 && <Token {...this.actions}/>}
        {step === 1 && <Templates {...this.state} {...this.actions}/>}
        {step === 2 && <Form {...this.state} {...this.actions}/>}
        {step === 3 && <Poller {...this.state} {...this.actions}/>}
      </div>
    )
  }
}

export default App;
