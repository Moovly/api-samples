import * as React from "react";
import validateResponse from "../util/validate-request";
import moment from "moment";

export default class Poller extends React.Component {
  state = {
    CHECK_INTERVAL: this.props.CHECK_INTERVAL || 60000,
    intervalId: null,
    lastTimeChecked: null,
    jobStatus: null,
    isFailed: false,
    isFinished: false
  };

  handleGetJobStatus = () => {
    this.setState({ lastTimeChecked: new Date().getTime() });

    fetch("https://api.moovly.com/generator/v1/jobs/" + this.props.jobId, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
      .then(validateResponse)
      .then(response => response.json())
      .then(response => {
        this.setState({
          jobStatus: response,
          isFinished: response.status === "finished" || response.status === "error"
        });
      })
      .catch(() => this.setState({ isFailed: true }, this.clearInterval));
  };

  componentDidMount() {
    this.handleGetJobStatus();

    // check every minute
    const intervalId = window.setInterval(this.handleGetJobStatus, this.state.CHECK_INTERVAL);
    this.setState({ intervalId });
  }

  componentDidUpdate(prevProps, prevState) {
    const { isFinished } = this.state;

    if (prevState.isFinished !== isFinished && isFinished) {
      this.clearInterval();
    }
  }

  clearInterval = () => {
    window.clearInterval(this.state.intervalId);
    this.setState({ intervalId: null });
  };

  render() {
    return (
      <div className={`step step-poller ${this.props.isDone && "step-done"}`}>
        <div className="step__info">
          <h2>Wait for the result</h2>
        </div>
        <div className="step__action">
          {this.state.jobStatus !== null && (
            <div className="job">
              <div>Status: {this.state.jobStatus.status}</div>
              <div className="job__videos">
                {this.state.jobStatus.videos.map(video => (
                  <div key={video.external_id} className="job__videos__video">
                    <ul>
                      <li>External Id: {video.external_id}</li>
                      <li>Status: {video.status}</li>
                      <li>
                        {video.status === "started" && <span>Result: TBD</span>}
                        {video.status === "success" && <span>Result: Done</span>}
                        {video.status === "success" && <a href={video.url}>View video</a>}
                        {video.status === "failed" && <span>Result: Error - {video.error}</span>}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>

              {!this.state.isFinished && (
                <div>
                  Last time checked: {moment(this.state.lastTimeChecked).format("h:mm:ss")}, Next check:{" "}
                  {moment(this.state.lastTimeChecked)
                    .add(1, "minutes")
                    .format("h:mm:ss")}
                </div>
              )}
            </div>
          )}
          <button onClick={window.location.reload}>Restart</button>
        </div>
      </div>
    );
  }
}
