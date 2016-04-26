import React, {Component} from 'react';


class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "World"
    }
  }

  onChange(e) {
    this.setState({name: e.target.value})
  }

  render() {
    return (
      <div>
        <div> Hello {this.state.name} </div>
        <input value={this.state.name} onChange={this.onChange.bind(this)}></input>
        <div>Change this div without reloading the page and resetting state.</div>
      </div>
    )
  }
}

export default MyComponent
