import { Store } from "webext-redux";
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
  interceptEnabledForTab?: boolean;
  checkedTabRecords: any;
  requestsToIntercept: Array<chrome.webRequest.WebRequestBodyDetails>;
  tabId?: number;
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
      chrome.runtime.onMessage.addListener(request => {
        switch (request.message) {
          case "CLEAR_DATA":
            this.clearAll();
            break;

          default:
            this.interceptSelected(request.message, request.tabId);
        }
      });
    });
  };

  clearAll = () => {
    this.runInterceptor({
      requestsToIntercept: [],
      checkedTabRecords: []
    });
  };

  interceptSelected = (message: string, tabId: number) => {
    const presentState = this.store.getState().rootReducer.tabRecord[tabId];
    if (!presentState) {
      return;
    }

    const isEmptyObject = (value: any) => {
      return Object.keys(value).length === 0;
    };

    const requestsToIntercept = presentState.requests.filter(
      (req: chrome.webRequest.WebRequestBodyDetails) => {
        return presentState.checkedReqs[req.requestId] && tabId;
      }
    );

    const checkedReqs = presentState.checkedReqs;
    let storeRequestRecords = presentState.requestRecords;
    let checkedTabRecords = {};
    for (let checkedReqId in checkedReqs) {
      if (checkedReqs[checkedReqId]) {
        if (!storeRequestRecords[checkedReqId].contentType) {
          storeRequestRecords[checkedReqId].contentType = "application/json";
        }
        if (!storeRequestRecords[checkedReqId].statusCode) {
          storeRequestRecords[checkedReqId].statusCode = "200";
        }
        checkedTabRecords[checkedReqId] = storeRequestRecords[checkedReqId];
      }
    }
    const requestObj = {
      interceptEnabledForTab: presentState.isInterceptorOn,
      requestsToIntercept,
      checkedTabRecords,
      tabId
    };

    if (message !== "DISABLE_INTERCEPTOR") {
      if (
        requestObj.requestsToIntercept.length < 1 ||
        !requestObj.tabId ||
        isEmptyObject(checkedTabRecords) ||
        requestObj.requestsToIntercept.find((req: chrome.webRequest.WebRequestBodyDetails) => {
          req.tabId !== requestObj.tabId;
        })
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
        this.store.dispatch(sendMessageToUI("Interception Success!", requestObj.tabId));
      } else if (message === "DISABLE_INTERCEPTOR" && !requestObj.interceptEnabledForTab) {
        this.disableInterceptor();
        this.store.dispatch(sendMessageToUI("Interception Disabled!", requestObj.tabId));
      }
    });
  };

  removeScriptFromDom = (querySelector: string) => {
    while (document.querySelectorAll(querySelector).length) {
      let elemToRemove = document.querySelector(querySelector) as Node;
      const parentElement: Node | null = elemToRemove.parentNode;
      parentElement.removeChild(elemToRemove);
    }
  };

  runInterceptor = (selectedReqs: selectedReqs) => {
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
                  xhr.respond(Number(requestArray.checkedTabRecords[request.requestId].statusCode), { "Content-Type": requestArray.checkedTabRecords[request.requestId].statusCode },requestArray.checkedTabRecords[request.requestId].responseText.toString())
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
    script.defer = false;
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
