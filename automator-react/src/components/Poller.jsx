import React from 'react';
import validateResponse from "../util/validate-request";
import moment from "moment";

class Poller extends React.Component
{
  CHECK_INTERVAL = 60000;
  interval = null;

  constructor(props)
  {
    super(props);

    this.state = {
      lastTimeChecked: null,
      jobStatus: null,
      isFailed: false,
      isFinished: false,
    }
  }

  handleGetJobStatus = () =>
  {
    this.setState({lastTimeChecked: (new Date()).getTime()});

    fetch('https://api.moovly.com/generator/v1/jobs/' + this.props.jobId, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(response => {this.setState({jobStatus: response}); return response})
      .then(response => this.setState({isFinished: response.status === 'finished'}))
      .catch(() => this.setState({isFailed: true}))
  };

  componentDidMount()
  {
    this.handleGetJobStatus();

    // check every minute
    this.interval = window.setInterval(this.handleGetJobStatus, this.CHECK_INTERVAL);
  }

  componentDidUpdate(prevProps, prevState)
  {
    if (prevState.isFailed !== this.state.isFailed && this.state.isFailed) {
      window.clearInterval(this.interval);
    }

    if (prevState.isFinished !== this.state.isFinished && this.state.isFinished) {
      window.clearInterval(this.interval);
    }
  }

  render()
  {
    return (
      <div className="step step-poller">
        JobId: {this.props.jobId}

        {this.state.jobStatus !== null && <div className="job">
          <div>Id: {this.props.jobId}</div>
          <div>Status: {this.state.jobStatus.status}</div>
          <div className="job__videos">
            {this.state.jobStatus.videos.map(video => {
              return (<div key={video.external_id}>
                <ul>
                  <li>External Id: {video.external_id}</li>
                  <li>Status: {video.status}</li>
                  <li>
                    {video.status === 'started' && <span>Result: TBD</span>}
                    {video.status === 'success' && <a href={video.url}>Result: Video</a>}
                    {video.status === 'failed' && <span>Result: Error - {video.error}</span>}
                  </li>
                </ul>
              </div>)
            })}
            <div>
              Last time checked: {moment(this.state.lastTimeChecked).format('h:mm:ss')},
              Next check: {moment(this.state.lastTimeChecked).add(1, 'minutes').format('h:mm:ss')}
            </div>
          </div>
        </div>}
      </div>
    )
  }
}

export default Poller;