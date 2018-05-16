import React from 'react';
import validateResponse from "../util/validate-request";

class Templates extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      templates: [],
      isRequested: false,
      isFinished: true,
      isFailed: false,
    }
  }

  componentDidMount()
  {
    this.setState({isRequested: true});

    fetch('https://api.moovly.com/generator/v1/templates', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      }
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(response => this.setState({isFinished: true, templates: response}))
      .catch(() => this.setState({isFailed: true}))
    ;
  }

  render()
  {
    return (
      <div className="step step-templates">
        <h2>Templates</h2>

        {this.state.isFailed && <div className="alert alert-danger">
          Something went wrong. Please reload the application to try again.
        </div>}

        {this.state.isRequested && !this.state.isFinished && <div className="alert alert-notice">
          We are still loading your templates.
        </div>}

        {this.state.isFinished && <ul>
          {this.state.templates.map(template => {
            return (
              <li
                onClick={this.props.handleSetTemplate.bind(null, template.id, template.variables)}
                key={template.id}
              >
                {template.name}
              </li>
            )
          })}
        </ul>}
      </div>
    );
  }
}

export default Templates;