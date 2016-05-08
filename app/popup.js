import React from "react"
import ReactDOM from "react-dom"
import MessageService from './message_service'

let messageService = new MessageService();

let enable = () => {
  chrome.tabs.getSelected(null, (tab) => {
    messageService.enableLogging(tab.url, tab.id);
  });
  window.close();
}

let disable = () => {
  chrome.tabs.getSelected(null, (tab) => {
    messageService.disableLogging(tab.url, tab.id);
  });
  window.close();
}

let statusButton = (enabled) => {
  if(enabled){
    return <button onClick={disable}>Disable</button>
  } else {
    return <button onClick={enable}>Enable</button>
  }
}
const Popup = (props) => {
  return(
    <div>
      {statusButton(props.enabled)}
    </div>
  );
}

chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
  messageService.getEnabledStatusForTab(tabs[0].id, (enabled) => {
    ReactDOM.render(<Popup enabled={enabled}/>, document.getElementById('root'));
  });
});
