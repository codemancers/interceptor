import React from 'react';
import Watch from './watch';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  renderRequests(requests) {
    return requests.map((request, index) => {
      return(<div key={index}>{request}</div>);
    })
  }

  // Extract into a separate class
  enableLogging(url, tabId) {
    chrome.runtime.sendMessage({message: "ENABLE_LOGGING", url: url, tabId: tabId});
  }

  onEnable(event) {
    event.preventDefault();
    chrome.tabs.getSelected(null, function(tab) {
      this.enableLogging(tab.url, tab.id);
    }.bind(this));
  }

  render() {
    return (
      <div>
        <Watch/>
        {this.renderRequests(this.props.requests)}
        <button ref="enable" onClick={this.onEnable.bind(this)}>Enable</button>
      </div>
    )
  }
}

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}
App.defaultProps = {
  requests: ["hello", "world"]
}

export default App
