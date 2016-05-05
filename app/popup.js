import React from "react"
import ReactDOM from "react-dom"
import App from './app';
import MessageService from './message_service'

let messageService = new MessageService();
chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
  messageService.getStore(tabs[0].id, (store) => {
    ReactDOM.render(<App requests={store.requests}/>, document.getElementById('root'));
  });
});
