import { initializeStore } from './store'
import React from "react"
import ReactDOM from "react-dom"
import App from './app';
import MessageService from './message_service'


require("./content_script.css");

class ForegroundWorker {
  constructor() {
    this.messageService = new MessageService();
    this.messageService.getRequests((requests) => {
      this.requestStore = initializeStore(requests);
      this.showWidgetIfEnabled();
      this.startMessageListener();
    });
  }

  showWidgetIfEnabled() {
    this.messageService.getEnabledStatus((enabled) => {
      if(enabled){
        this.showWidget();
      }
    });
  }

  showWidget() {
    let widget = document.createElement("div");
    widget.setAttribute("id", "interceptor-container");
    document.body.insertBefore(widget, document.body.firstChild);
    this.requestStore.subscribe(() => {
      this.renderWidget(this.requestStore.getState());
    });
    this.renderWidget(this.requestStore.getState());
  }

  renderWidget(requests) {
    ReactDOM.render(<App requests={requests}/>, document.getElementById('interceptor-container'));
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.message) {
        case 'ENABLE_LOGGING':
          this.showWidget();
          break;
        case 'LOG_REQUEST':
          this.requestStore.dispatch({type: "ADD_REQUEST", request: request.request});
          break;
        case 'RESET_DATA':
          this.requestStore.dispatch({type: "CLEAR_REQUESTS"});
          break;
      }
    })
  }
}

let worker = new ForegroundWorker();
