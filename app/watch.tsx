import * as React from 'react';

interface WatchProps {

}

interface WatchState {
  watchRegex: string
}

class Watch extends React.Component<WatchProps, WatchState> {
  state = { watchRegex: "*" }

  handleOnChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const target = event.currentTarget;

    this.setState({watchRegex: target.value});
  }

  render() {
    return (
      <div>
        <input value={this.state.watchRegex} onChange={this.handleOnChange} />
      </div>
    )
  }
}

export default Watch
