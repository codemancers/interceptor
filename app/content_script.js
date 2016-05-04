import { requestStore } from './store'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.message == "LOG_REQUEST"){
    requestStore.dispatch({type: "ADD_REQUEST", request: request.request});
  } else if(request.message == "GET_STORE") {
    sendResponse({requests: requestStore.getState()});
  }
});
