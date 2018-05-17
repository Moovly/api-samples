import * as React from 'react';
import validateResponse from "../../util/validate-request";

class AssetUpload extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      object: null,
      file: null,
      isError: false,
    }
  }

  onFileSelect = (e) =>
  {
    const file = e.target.files[0];

    this.setState({file});

    let formData = new FormData();

    formData.append('files', file, file.name);

    fetch("https://api.moovly.com/api2/v1/objects/upload", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
      body: formData
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(response => {
        this.setState({object: response[0]})
      })
      .catch(() => this.setState({isError: true}))
    ;
  };

  onReset = (e) =>
  {
    e.preventDefault();

    this.setState({object: null, file: null});
  };

  render()
  {
    return (
      <div className="form-element">
        {this.state.object === null && this.state.file === null && <React.Fragment>
          <label htmlFor={this.props.variable.id + this.props.externalId}>{this.props.variable.name}</label>
          <input
            type="file"
            id={this.props.variable.id + this.props.externalId}
            onChange={this.onFileSelect}
            name={this.props.variable.id + this.props.externalId}
          />
        </React.Fragment>}
        {this.state.object == null && this.state.file !== null && <React.Fragment>
          <label>{this.props.variable.name}</label>
          <div className="input__like-element">
            {!this.state.isError && <span>Your file is being uploaded.</span>}
            {this.state.isError && <div>
              <span>Something went wrong.</span>
              <button onClick={this.onReset}>Try again</button>
            </div>}
          </div>
        </React.Fragment>}
        {this.state.object !== null && this.state.file !== null && <React.Fragment>
          <label>{this.props.variable.name}</label>

          <div className="input__like-element">
            <span>Your file has been uploaded with the name {this.state.object.metadata.label}.</span>
            <button onClick={this.onReset}>
              Reset
            </button>
          </div>
        </React.Fragment>}
      </div>
    )
  }
}

export default AssetUpload;