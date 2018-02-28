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
        this.interceptSelected(request.requestsToIntercept);
      }
    });
  };
  interceptSelected = (selectedReqs: Array<requestObject>) => {
    var selectedInterceptCode =`
    (function(){
      function remove(querySelector) {
        let elemToRemove = document.querySelector(querySelector);
        elemToRemove.parentNode.removeChild(elemToRemove);
      };
      while(document.querySelectorAll("#tmpScript-2").length){
        remove("#tmpScript-2");
      }

       let fakeServerWrapper = (requestArray) => {
          this.data = requestArray;
          this.init = () => {
            this.server = sinon.fakeServer.create({logger : console.log})
            this.server.xhr.useFilters = true;
            let async = false
            this.server.xhr.addFilter((method, url, async, username, password) => {
                  return false
             });
            this.data.forEach((request) => {
              this.register(request.url, request.method)
            })
          };

          this.register = (method, url) => {
            console.log(method, url)
            this.server.respondWith(method, url, [
              200,
              { "Content-Type": "application/json" },
              '[{ "id": 12, "comment": "Hey there" }]'
          ]);
          this.server.respond();
          }
          this.init()
      };
      window.interceptor = fakeServerWrapper(${JSON.stringify([...selectedReqs])})
    })()`



    let script = document.createElement("script");
    script.defer = true;
    script.id = "tmpScript-2";
    script.type = "text/javascript";
    script.textContent = selectedInterceptCode;
    (document.head || document.documentElement).appendChild(script);
  };
  injectScripts = () => {
    let sinon = document.createElement("script");
    sinon.defer = false;
    sinon.src = chrome.extension.getURL("./lib/sinon.js");
    (document.head || document.documentElement).appendChild(sinon);
  };
  initScript = (request: requestObject) => {
    let actualCode = `
    function remove(querySelector) {
      let elemToRemove = document.getElementById(querySelector);
      elemToRemove.parentNode.removeChild(elemToRemove);
    };
    if (document.getElementById("tmpScript")) {
      remove("tmpScript");
    }
    let request = ${JSON.stringify(request)};
    let sinonServer = sinon.fakeServer.create();

    sinonServer.respondWith('${request.method}', '${
      request.url
    }',[200, { "Content-Type": "application/json" },'[${JSON.stringify(
      request.responseText
    )}]']);
    sinonServer.respondImmediately = true;`;
    var script = document.createElement("script");
    script.defer = true;
    script.id = "tmpScript";
    script.type = "text/javascript";
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
  };
}
new Intercept().startMessageListener();