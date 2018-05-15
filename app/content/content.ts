import { Store } from "react-chrome-redux";
import { sendMessageToUI } from "./../actions";

interface BgStore {
  ready(): Promise<void>;
  getState(): any;
  dispatch: any;
}

export interface responseField {
  [requestId: number]: string;
}
export interface statusCodes {
  [statusCode: number]: string;
}
export interface contentType {
  [contentType: number]: string;
}
interface selectedReqs {
  contentType: contentType;
  interceptEnabledForTab: boolean;
  message: string;
  requestsToIntercept: Array<chrome.webRequest.WebRequestBodyDetails>;
  responseText: responseField;
  statusCodes: statusCodes;
  tabId: number;
}
export type GenericCallbackWithoutParams = () => void;
class Intercept {
  store: BgStore;
  constructor() {
    this.store = new Store({
      portName: "INTERCEPTOR"
    });
  }
  startMessageListener = () => {
    this.store.ready().then(() => {
      chrome.runtime.onMessage.addListener((request, _, __) => {
        this.interceptSelected(request.message, request.tabId);
      });
    });
  };
  interceptSelected = (message: string, tabId: number) => {
    const presentState = this.store.getState();
    const checkedReqs = presentState.requests.filter(req => {
      return presentState.checkedReqs[req.requestId] && tabId;
    });
    const requestObj = {
      message: message,
      interceptEnabledForTab: presentState.isInterceptorOn[tabId],
      requestsToIntercept: checkedReqs,
      responseText: presentState.responseText,
      statusCodes: presentState.statusCodes,
      contentType: presentState.contentType,
      tabId: tabId
    };
    if (message !== "DISABLE_INTERCEPTOR") {
      if (
        requestObj.requestsToIntercept.length < 1 ||
        !requestObj.tabId ||
        requestObj.requestsToIntercept.find(req => req.tabId !== requestObj.tabId)
      ) {
        return;
      }
    }
    this.injectScripts(() => {
      if (
        (message === "INTERCEPT_CHECKED" || message === "PAGE_REFRESHED") &&
        requestObj.interceptEnabledForTab
      ) {
        this.runInterceptor(requestObj);
        this.store.dispatch(sendMessageToUI("Interception Success!"));
      } else if (message === "DISABLE_INTERCEPTOR" && !requestObj.interceptEnabledForTab) {
        this.disableInterceptor();
        this.store.dispatch(sendMessageToUI("Interception Disabled!"));
      }
    });
  };

  setDefaultValues = (
    responseField: responseField,
    requestsToIntercept: Array<chrome.webRequest.WebRequestBodyDetails>,
    defaultResponseValue: string
  ) => {
    requestsToIntercept.forEach((req: chrome.webRequest.WebRequestBodyDetails) => {
      if (!responseField[Number(req.requestId)]) {
        responseField[Number(req.requestId)] = defaultResponseValue;
      }
    });
    return responseField;
  };

  removeScriptFromDom = (querySelector: string) => {
    while (document.querySelectorAll(querySelector).length) {
      let elemToRemove = document.querySelector(querySelector);
      elemToRemove.parentNode.removeChild(elemToRemove);
    }
  };

  runInterceptor = (selectedReqs: selectedReqs) => {
    console.log(selectedReqs);
    let responseTexts = selectedReqs.responseText || {};
    let statusCodes = selectedReqs.statusCodes || {};
    let contentType = selectedReqs.contentType || {};
    this.setDefaultValues(responseTexts, selectedReqs.requestsToIntercept, "");
    this.setDefaultValues(statusCodes, selectedReqs.requestsToIntercept, "200");
    this.setDefaultValues(contentType, selectedReqs.requestsToIntercept, "application/json");

    var selectedInterceptCode = `
     (function(){
       if (window.interceptor) {
         window.interceptor.server = null;
       }
      function matchUrl(urlfromSinon, urlFromArray){
          const aTag = document.createElement('a');
          aTag.href = urlfromSinon
          requestUrl = new URL(urlFromArray)
          aTagSearchParams = new URLSearchParams(aTag.search)
          reqUrlParams = new URLSearchParams(requestUrl.search)
          aTagSearchParams.sort();
          reqUrlParams.sort()
          return (aTag.hostname === requestUrl.hostname && aTag.pathname === requestUrl.pathname && aTagSearchParams.toString() === reqUrlParams.toString())
      }

       function sinonHandler(requestArray) {
           this.server = nise.fakeServer.create({ logger: console.log });
           this.server.autoRespond = true;
           this.server.xhr.filters = [];
           this.server.xhr.useFilters = true;
            //If the filter returns true, the request will not be faked - leave original
           this.server.xhr.addFilter(function(method, url, async, username, password) {
             const result = requestArray.requestsToIntercept.find((request) => {
               return matchUrl(url, request.url)
             })
             return !result
           });
           this.server.respondWith((xhr, id) => {
             const respondUrl = requestArray.requestsToIntercept.find((request) => {
                if( matchUrl(xhr.url, request.url ) && xhr.method === request.method){
                  xhr.respond(Number(requestArray.statusCodes[request.requestId]), { "Content-Type": requestArray.contentType[request.requestId] },requestArray.responseText[request.requestId].toString())
                }
             })
           })
           if (window.interceptor) {
            window.interceptor = null
          }
         }
          window.interceptor = new sinonHandler(${JSON.stringify(selectedReqs)});
     })();`;

    let script = document.createElement("script");
    script.defer = true;
    script.id = "enableInterceptorScript";
    script.type = "text/javascript";
    script.textContent = selectedInterceptCode;
    (document.head || document.documentElement).appendChild(script);
    this.removeScriptFromDom("#enableInterceptorScript");
  };

  disableInterceptor = () => {
    var selectedInterceptCode = `
      (function(){
        if(window.interceptor){
          window.interceptor.server.restore()
        }
      })();`;
    let script = document.createElement("script");
    script.defer = true;
    script.id = "disableInterceptorScript";
    script.type = "text/javascript";
    script.textContent = selectedInterceptCode;
    (document.head || document.documentElement).appendChild(script);
    this.removeScriptFromDom("#disableInterceptorScript");
  };

  injectScripts = (callback: GenericCallbackWithoutParams) => {
    let sinonScript = document.createElement("script");
    sinonScript.defer = false;
    sinonScript.src = chrome.extension.getURL("./lib/nise.min.js");
    sinonScript.type = "text/javascript";
    sinonScript.id = "interceptor-sinon";
    if (!document.getElementById("interceptor-sinon")) {
      (document.head || document.documentElement).appendChild(sinonScript);
    } else {
      callback();
    }
    sinonScript.onload = callback;
  };
}
new Intercept().startMessageListener();
