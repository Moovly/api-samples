import * as React from "react";
import "../styles/App.css";
import Token from "./Token";
import Templates from "./Templates";
import Form from "./Form";
import Poller from "./Poller";
import "url-search-params-polyfill";
import Theme from "./Theme";

class App extends React.Component {
   parameters = new URLSearchParams(window.location.search);

  state = {
    token: this.parameters.get("token") || null,
    isTokenValid: false,
    templateId: null,
    variables: null,
    jobId: null
  };

  isTokenFormHidden = () => this.parameters.get("token_hidden") === "1" || false;

  handleSetToken = (token, valid) => {
    this.setState({ token, isTokenValid: valid });
  };

  handleSetTemplate = (templateId, variables) => {
    this.setState({ templateId, variables });
  };

  handleSetValues = values => {
    this.setState({ values });
  };

  handleSetJobId = jobId => {
    this.setState({ jobId });
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

  render() {
    const step = this.getStep();

    return (
      <Theme>
        <Token {...this.state} {...this.actions} isDone={step >= 1} isHidden={this.isTokenFormHidden()} />
        {step >= 1 && <Templates {...this.state} {...this.actions} isDone={step >= 2} />}
        {step >= 2 && <Form {...this.state} {...this.actions} isDone={step >= 3} />}
        {step >= 3 && <Poller {...this.state} {...this.actions} />}
      </Theme>
    );
  }
}

export default App;
