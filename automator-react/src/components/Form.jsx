import * as React from "react";
import FormElement from "./FormElement";
import validateResponse from "../util/validate-request";

export default class FormContainer extends React.Component {
  EXTERNAL_ID_PREFIX = "automator-react-external-id-";

  state = {
    externalIdCount: 0,
    videoExternalIds: [],
    values: [],
    isRequested: false,
    isDone: false,
    isFailed: false,
    errorText: null
  };

  componentDidMount = () => {
    this.handleAddVideo();
  };

  handleAddVideo = () => {
    const name = `${this.EXTERNAL_ID_PREFIX}-${this.state.externalIdCount}`;

    this.setState(({ externalId, videoExternalIds }) => ({
      externalIdCount: externalIdCount + 1,
      videoExternalIds: [...videoExternalIds, name]
    }));
  };

  handleRemoveVideo = toBeRemoved => {
    this.setState(({ videoExternalIds, values }) => ({
      videoExternalIds: videoExternalIds.filter(externalId => externalId !== toBeRemoved),
      values: values.filter(({ external_id }) => external_id !== toBeRemoved)
    }));
  };

  handleStartRendering = e => {
    e.preventDefault();

    const requestData = {
      template_id: this.props.templateId,
      options: {
        quality: "1080p"
      },
      values: this.state.values
    };

    this.setState({ isRequested: true, isDone: false, errorText: null });

    fetch("https://api.moovly.com/generator/v1/jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(response => {
        if (response.status === "error") {
          throw new Error(JSON.stringify(response));
        }

        this.props.handleSetJobId(response.id);
        this.setState({ isDone: true });
      })
      .catch(e => this.setState({ isFailed: true, isDone: true }));
  };

  setValue = (externalId, variableId, content) => {
    this.setState(({ values }) => {
      const valueIndex = values.findIndex(({ external_id }) => external_id === externalId);
      const isNewValue = valueIndex === -1;

      if (isNewValue) {
        const newValue = {
          external_id: externalId,
          title: "Moov " + externalId,
          template_variables: {
            [variableId]: content
          }
        };

        return {
          values: [...values, newValue]
        };
      } else {
        return {
          values: values.map(v => {
            if (v.external_id === externalId) {
              return {
                ...v,
                template_variables: {
                  ...v.template_variables,
                  [variableId]: content
                }
              };
            } else return v;
          })
        };
      }
    });
  };

  render() {
    const { isRequested, isDone, isFailed } = this.state;
    const variables = this.props.variables.sort((a, b) => Math.sign(a.weight - b.weight));

    const isProcessing = isRequested && !isDone && !isFailed;
    const isFailed = isRequested && isDone && isFailed;
    const isSuccessful = isDone && isFailed;

    return (
      <div className={`step step-form ${this.props.isDone && "step-done"}`}>
        <div className="step__info">
          <h2>Data</h2>
        </div>
        <div className="step__action">
          <form>
            {this.state.videoExternalIds.map(externalId => (
              <div key={externalId} className="video-form">
                <div className="video-form__name">
                  {externalId}
                  <button onClick={this.handleRemoveVideo.bind(null, externalId)}>Remove</button>
                </div>
                <div className="video-form__form">
                  {variables.map(variable => (
                    <FormElement
                      key={variable.id}
                      variable={variable}
                      externalId={externalId}
                      setValue={this.setValue}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <button
                  onClick={e => {
                    e.preventDefault();
                    this.handleAddVideo();
                  }}
                  formNoValidate
                >
                  Add a video
                </button>
              </div>
              <div>
                <button onClick={this.handleStartRendering}>Start rendering</button>
              </div>
            </div>
          </form>
          {isProcessing && <div className="alert alert-info">We are submitting your request.</div>}
          {isFailed && <div className="alert alert-danger">The request failed. Please try again.</div>}
          {isSuccessful && <div className="alert alert-info">Your request was successful.</div>}
        </div>
      </div>
    );
  }
}
