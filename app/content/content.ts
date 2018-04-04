import {Store} from "react-chrome-redux";
import { sendSuccessMessage } from './../actions'
import { GenericCallback } from "./../message_service";
interface requestObject {
  url: string;
  method: string;
  requestId: number;
  timeStamp: number;
  responseText: string;
}

interface BgStore{
  ready(): Promise<void>;
  getState(): any;
  dispatch : any;
}
class Intercept {
  store:BgStore
  constructor(){
    this.store = new Store({
      portName: "INTERCEPTOR"
    });
  }
  startMessageListener = () => {
    this.store.ready().then( () => {
      chrome.runtime.onMessage.addListener((request, _, __) => {
        if (request.message === "INTERCEPT_CHECKED") {
          this.interceptSelected(request);
        } else if (request.message === "PAGE_REFRESHED") {
          const presentState = this.store.getState();
          const checkedReqs = presentState.requests.filter(req => {
            return presentState.checkedReqs[req.requestId] && request.tabId;
          });
          const requestObj = {
            message: "INTERCEPT_ON_REFRESH",
            requestsToIntercept: checkedReqs,
            responseText: presentState.responseText,
            statusCodes: presentState.statusCodes,
            contentType: presentState.contentType,
            tabId: request.tabId
          };
          this.interceptSelected(requestObj);
        }
      });
    })
  };
  interceptSelected = (selectedReqs: Array<requestObject>) => {
    if (selectedReqs.requestsToIntercept.length < 1 || !selectedReqs.tabId || selectedReqs.requestsToIntercept.find( (req) => req.tabId !== selectedReqs.tabId )){
      return;
    }
    this.injectScripts(() => {
      this.runInterceptor(selectedReqs);
    });
    this.store.dispatch(sendSuccessMessage("Interception Success!"))
  };

  setDefaultValues = (responseField, requestsToIntercept, defaultResponseValue) => {
      requestsToIntercept.forEach(req => {
        if (!(responseField[req.requestId])) {
          responseField[req.requestId] = defaultResponseValue;
        }
      });
    return responseField;
  }

  runInterceptor  = (selectedReqs) => {
    let responseTexts = selectedReqs.responseText || {};
    let statusCodes = selectedReqs.statusCodes || {};
    let contentType = selectedReqs.contentType || {};
    this.setDefaultValues(responseTexts,selectedReqs.requestsToIntercept, " ")
    this.setDefaultValues(statusCodes,selectedReqs.requestsToIntercept, "200")
    this.setDefaultValues(contentType,selectedReqs.requestsToIntercept, "application/json")

    var selectedInterceptCode =`
     (function(){
       function remove(querySelector) {
         let elemToRemove = document.querySelector(querySelector);
         elemToRemove.parentNode.removeChild(elemToRemove);
       };
       function matchUrl(url, requestUrl, domain){
          if (url.indexOf('://') < 0) {
            return requestUrl.replace(domain, "")
           }
           return requestUrl;
       }
       while(document.querySelectorAll("#tmpScript-2").length){
         remove("#tmpScript-2");
       }
       if (window.interceptor) {
         window.interceptor.server.xhr.filters = [];
       }
       function sinonHandler(requestArray) {
           this.server = sinon.fakeServer.create({ logger: console.log });
           this.server.autoRespond = true;
           this.server.xhr.useFilters = true;
            //If the filter returns true, the request will not be faked - leave original
           this.server.xhr.addFilter(function(method, url, async, username, password) {
             const result = requestArray.requestsToIntercept.find((request) => {
               console.log(url, request.url)
               const incomingUrl = url
               const requestUrl = new URL(request.url)
               const host = requestUrl.host
               //const urlpathName = requestUrl.pathname;
               console.log("INCLUDES", request.url.includes(url))
               if(!request.url.includes(url)){
                return true
               }
             })
             console.log(!result)
             return result
           });
           this.server.respondWith((xhr, id) => {
             const respondUrl = requestArray.requestsToIntercept.find((request) => {
               console.log("IN RESPOND")
               //const matchedUrl = matchUrl(xhr.url, request.url, request.initiator)
                if((request.url.includes(xhr.url)) && xhr.method === request.method){
                  console.log("THIS URL", xhr.url, "IN RESPOND:::MATCHES?", request.url)
                  console.log("INTERCEPT STATUSCODE",Number(requestArray.statusCodes[request.requestId]) )
                  console.log("INTERCEPT CONTENT_Type", requestArray.contentType[request.requestId])
                  console.log("RESPONSE TEXT", requestArray.responseText[request.requestId].toString())
                  xhr.respond(Number(requestArray.statusCodes[request.requestId]), { "Content-Type": requestArray.contentType[request.requestId] },requestArray.responseText[request.requestId].toString())
                }
             })
           })
           if (window.interceptor) {
            window.interceptor = null
          }
         }
         window.interceptor = new sinonHandler(${JSON.stringify(selectedReqs)});
     })();`

    let script = document.createElement("script");
    script.defer = true;
    script.id = "tmpScript-2";
    script.type = "text/javascript";
    script.textContent = selectedInterceptCode;
    (document.head || document.documentElement).appendChild(script);
    }

  injectScripts = (callback:GenericCallback) => {
    let sinonScript = document.createElement("script");
    sinonScript.defer = false;
    sinonScript.src = chrome.extension.getURL("./lib/sinon.js");
    sinonScript.type="text/javascript";
    sinonScript.id="interceptor-sinon";
    if(!document.getElementById("interceptor-sinon")){
      (document.head || document.documentElement).appendChild(sinonScript);
    }
    console.log("INJECTED SINON")
    // let searchScript = document.createElement("script");
    // searchScript.defer = false;
    // searchScript.src = chrome.extension.getURL("./lib/url-search-params.js");
    // searchScript.type="text/javascript";
    // searchScript.id="interceptor-search";
    // if(!document.getElementById("interceptor-search")){
    //   (document.head || document.documentElement).appendChild(searchScript);
    // }
    // searchScript.onload && sinonScript.onload = callback;
    // console.log("INJECTED SEARCH")
    sinonScript.onload = callback;
  };

}
new Intercept().startMessageListener();
