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
    const defaultResponseText = `{msg : "hello"}`
    const defaultStatusCodes = "200"
    if(Object.keys(responseTexts).length === 0 && responseTexts.constructor === Object){
      responseTexts = selectedReqs.requestsToIntercept.map( (req) => {
         responseTexts[req.requestId] = defaultResponseText
      } )
    }
    if(Object.keys(statusCodes).length === 0 && statusCodes.constructor === Object){
      statusCodes = selectedReqs.requestsToIntercept.map( (req) => {
        statusCodes[req.requestId] = defaultStatusCodes
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
        console.log(requestArray)
           this.server = sinon.fakeServer.create({ logger: console.log });
           this.server.autoRespond = true;
           this.server.xhr.useFilters = true;
            //If the filter returns true, the request will not be faked - leave original
           this.server.xhr.addFilter(function(method, url, async, username, password) {
             const result = requestArray.requestsToIntercept.find((request) => {
              console.log(request.url, url)
              console.log(request.url === url)
               return request.url === url;
             })
             return !result
           });
           this.server.respondWith((xhr, id) => {
             xhr.respond(200, { "Content-Type": "application/json" },'[{ "id": 12, "comment": "Hello there" }]')
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
  initScript = (request: requestObject) => {
    let actualCode =`
    function remove(querySelector) {
      let elemToRemove = document.getElementById(querySelector);
      elemToRemove.parentNode.removeChild(elemToRemove);
    };
    while(document.getElementById("tmpScript")) {
      remove("tmpScript");
    }
    if (window.interceptor2) {
      window.interceptor2.server.xhr.filters = [];
    }
    function sinonSingleHandler(request) {
      this.server = sinon.fakeServer.create({ logger: console.log });
      this.server.autoRespond = true;
      this.server.xhr.useFilters = true;
      // If the filter returns true, the request will not be faked - leave original
      this.server.xhr.addFilter(function(method, url, async, username, password) {
        const result = (request.url === url)
        return !result
      });
      this.server.respondWith((xhr, id) => {
        xhr.respond(${request.statusCode}, { "Content-Type": "application/json" },'[${JSON.stringify(request.responseText)}]')
      })
    }
    window.interceptor2 = new sinonSingleHandler(${JSON.stringify(request)});
    `
    var script = document.createElement("script");
    script.defer = true;
    script.id = "tmpScript";
    script.type = "text/javascript";
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
  };
}
new Intercept().startMessageListener();
