interface requestObject {
  url: string;
  method: string;
  requestId: number;
  timeStamp: number;
  responseText: string;
}
class Intercept {
  constructor() {
    this.injectScripts();
  }
  startMessageListener = () => {
    chrome.runtime.onMessage.addListener((request, _, __) => {
      if (request.message == "INTERCEPT_REQUEST") {
        this.initScript(request.requestDetail);
      }
      if (request.message === "INTERCEPT_CHECKED") {
        this.interceptSelected(request);
      }
    });
  };
  interceptSelected = (selectedReqs: Array<requestObject>) => {
    let responseTexts = selectedReqs.responseText || {};
    let statusCodes = selectedReqs.statusCodes || {}
    let contentType = selectedReqs.contentType || {}
    const defaultResponseText = `{msg : "hello"}`
    const defaultStatusCode = "200"
    const defaultContentType= "application/json"
    if(Object.keys(responseTexts).length === 0 && responseTexts.constructor === Object){
      responseTexts = selectedReqs.requestsToIntercept.map( (req) => {
         responseTexts[req.requestId] = defaultResponseText
      } )
    }
    if(Object.keys(statusCodes).length === 0 && statusCodes.constructor === Object){
      statusCodes = selectedReqs.requestsToIntercept.map( (req) => {
        statusCodes[req.requestId] = defaultStatusCode
      } )
    }
    if(Object.keys(contentType).length === 0 && contentType.constructor === Object){
      contentType = selectedReqs.requestsToIntercept.map( (req) => {
        contentType[req.requestId] = defaultContentType
      } )
    }

    var selectedInterceptCode =`
     (function(){
       function remove(querySelector) {
         let elemToRemove = document.querySelector(querySelector);
         elemToRemove.parentNode.removeChild(elemToRemove);
       };
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
               return request.url === url;
             })
             return !result
           });
           this.server.respondWith((xhr, id) => {
             const respondUrl = requestArray.requestsToIntercept.find((request) => {
              if(xhr.url === request.url){
                console.log(requestArray.statusCodes[request.requestId])
                xhr.respond(Number(requestArray.statusCodes[request.requestId]), { "Content-Type": requestArray.contentType[request.requestId] },requestArray.responseText[request.requestId].toString())
              }
             })
           })
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
  injectScripts = () => {
    let sinon = document.createElement("script");
    sinon.defer = false;
    sinon.src = chrome.extension.getURL("./lib/sinon.js");
    (document.head || document.documentElement).appendChild(sinon);
  };
}
new Intercept().startMessageListener();
