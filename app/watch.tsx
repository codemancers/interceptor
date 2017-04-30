import React from 'react';

class Watch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      watchRegex: "*"
    }
  }

  onChange(event) {
    this.setState({watchRegex: event.target.value});
  }

  render() {
    return (
      <div>
        <input value={this.state.watchRegex} onChange={this.onChange.bind(this)}/>
      </div>
    )
  }
}

export default Watch
