import * as React from "react";

export default class Theme extends React.Component {
  render() {
    return (
      <div>
        <header>
          <img src="https://dashboard.moovly.com/images/moovly.svg" />
          <div className="title">Automator</div>
        </header>
        <main>{this.props.children}</main>
        <footer />
      </div>
    );
  }
}
