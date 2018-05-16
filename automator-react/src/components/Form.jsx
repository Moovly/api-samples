import React from 'react';
import FormElement from "./FormElement";
import clone from 'clone';
import validateResponse from "../util/validate-request";

class FormContainer extends React.Component
{
  EXTERNAL_ID_PREFIX = 'automator-react-external-id-';

  constructor(props)
  {
    super(props);

    this.state = {
      externalIdCount: 0,
      videoExternalIds: [],
      values: [],
      isRequested: false,
      isDone: false,
      isFailed: false,
    };
  }

  handleAddVideo = () => {
    const name = `${this.EXTERNAL_ID_PREFIX}-${this.state.externalIdCount}`;

    let externalIds = this.state.videoExternalIds.slice(0);

    externalIds.push(name);

    this.setState({
      externalIdCount: this.state.externalIdCount + 1,
      videoExternalIds: externalIds
    })
  };

  handleStartRendering = (e) => {
    e.preventDefault();

    const requestData = {
      template_id: this.props.templateId,
      options: {
        quality: "1080p",
      },
      values: this.state.values,
    };

    this.setState({isRequested: true, isDone: false});

    console.log(requestData);

    fetch('https://api.moovly.com/generator/v1/jobs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(response => {this.setState({setDone: true}); return response})
      .then(response => this.props.handleSetJobId(response.id))
      .catch(() => this.setState({isFailed: true}))
    ;
  };

  setValue = (externalId, variableId, content) => {
    let values = this.state.values.splice(0);

    let value = values.find(value => value.external_id === externalId);
    values = values.filter(value => value.external_id !== externalId);

    const isNewValue = value === undefined;

    if (isNewValue) {
      let templateVariables = {};

      templateVariables[variableId] = content;

      value = {
        "external_id": externalId,
        "title": "Moov " + externalId,
        "template_variables": templateVariables
      }
    }

    if (!isNewValue) {
      value = clone(value);

      value.template_variables[variableId] = content;
    }

    values.push(value);

    this.setState({
      values: values,
    })
  };

  render()
  {
    const variables = this.props.variables.sort((a, b) => {
      return Math.sign(a.weight - b.weight);
    });

    return (
      <div className="step step-form">
        <button onClick={this.handleAddVideo}>Add a video</button>

        {this.state.isRequested && !this.state.isDone && !this.state.isFailed && <div className="alert alert-info">
          We are submitting your request.
        </div>}

        {this.state.isRequested && this.state.isDone && this.state.isFailed && <div className="alert alert-danger">
          The request failed. Please reload the page and try again.
        </div>}

        <form>
          {this.state.videoExternalIds.map(externalId => {
            return (
              <div key={externalId} className="video-form">
                <div className="video-form__name">
                  {externalId}
                </div>
                <div className="video-form__form">
                  {variables.map(variable => {
                    return (<FormElement
                      key={variable.id}
                      variable={variable}
                      externalId={externalId}
                      setValue={this.setValue}
                    />);
                  })}
                </div>
              </div>
            )
          })}

          <button onClick={this.handleStartRendering}>Start rendering</button>
        </form>
      </div>
    )
  }
}

export default FormContainer;