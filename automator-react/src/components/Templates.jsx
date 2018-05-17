import * as React from "react";
import validateResponse from "../util/validate-request";

export default class Templates extends React.Component {
  state = {
    templates: [],
    selectedTemplate: null,
    isRequested: false,
    isFinished: true,
    isFailed: false
  };

  componentDidMount() {
    this.setState({ isRequested: true });

    fetch("https://api.moovly.com/generator/v1/templates", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(response => this.setState({ isFinished: true, templates: response }))
      .catch(() => this.setState({ isFailed: true }));
  }

  handlePickTemplate = template => {
    this.props.handleSetTemplate(template.id, template.variables);

    this.setState({ selectedTemplate: template.id });
  };

  render() {
    return (
      <div className={`step step-templates ${this.props.isDone ? "step-done" : ""}`}>
        <div className="step__info">
          <h2>Templates</h2>
        </div>

        <div className="step__action">
          {this.state.isFailed && (
            <div className="alert alert-danger">Something went wrong. Please reload the application to try again.</div>
          )}

          {this.state.isRequested &&
            !this.state.isFinished && <div className="alert alert-notice">We are still loading your templates.</div>}

          {this.state.isFinished && (
            <div className="templates">
              {this.state.templates.map(template => {
                return (
                  <div
                    onClick={this.handlePickTemplate.bind(null, template)}
                    key={template.id}
                    className={`templates__template ${this.state.selectedTemplate === template.id ? "selected" : ""}`}
                  >
                    <div className="templates__template__img">
                      <img src={template.thumb} />
                    </div>
                    <div className="templates__template__name">{template.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}
