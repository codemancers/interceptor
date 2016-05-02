import React from 'react';
//import Watch from './watch';
import RequestList from './request_list'
import MessageService from './message_service'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.messageService = new MessageService();
    this.state = {
      enabled: false
    }
  }

  onEnableToggle(event) {
    event.preventDefault();
    this.setState({enabled: !this.state.enabled}, () => {
      if(this.state.enabled) {
        chrome.tabs.getSelected(null, (tab) => {
          this.messageService.enableLogging(tab.url, tab.id);
        });
      } else {
        //chrome.tabs.getSelected(null, function(tab) {
          //this.messageService.disableLogging(tab.url, tab.id);
        //});
      }
    });
  }

  getEnableStatus(enabled) {
    return enabled ? "Disable" : "Enable";
  }

  render() {
    return (
      <div>
        {/* <Watch/> */}
        <RequestList requests={this.props.requests}/>

        <button ref="enable" onClick={this.onEnableToggle.bind(this)}>
          {this.getEnableStatus(this.state.enabled)}
        </button>
      </div>
    )
  }
}

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}
App.defaultProps = {
  requests: []
}

export default App
