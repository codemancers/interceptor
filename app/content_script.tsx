import { initializeStore } from './store'
import * as React from "react"
import * as ReactDOM from "react-dom"
import App from './app';
import * as MessageService from './message_service'
// Note: This might not work since we don't have a webpack-based loader. Need
// to figure out if this is natively supported in TS.
import styles from './content_script.css'
import { RequestObj } from './request_list'


// since this looks like a bunch of functions getting executed one after other,
// may be move this out of the class.
class ForegroundWorker {
  requestStore: any

  constructor() {
    MessageService.getRequests((requests: Array<RequestObj>) => {
      this.requestStore = initializeStore(requests);
      this.showWidgetIfEnabled();
      this.startMessageListener();
    });
  }

  showWidgetIfEnabled() {
    MessageService.getEnabledStatus((enabled: boolean) => {
      if (enabled){
        this.showWidget();
      }
    });
  }

  showWidget() {
    const widget = document.createElement("div");
    widget.setAttribute("id", "interceptor-container");
    widget.setAttribute("class", styles['interceptor-container']);
    document.body.insertBefore(widget, document.body.firstChild);
    this.requestStore.subscribe(() => {
      this.renderWidget(this.requestStore.getState());
    });
    this.renderWidget(this.requestStore.getState());
  }

  renderWidget(requests: Array<RequestObj>) {
    ReactDOM.render(<App requests={requests} />, document.getElementById('interceptor-container'));
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request) => {
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

new ForegroundWorker();
