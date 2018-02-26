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
      if(request.message === "INTERCEPT_CHECKED"){
        this.interceptSelected(request.requestsToIntercept)
      }
    });
  };
  interceptSelected = (selectedReqs:Array<requestObject>) => {
    var selectedInterceptCode = `
    function remove(querySelector) {
      let elemToRemove = document.querySelector(querySelector);
      elemToRemove.parentNode.removeChild(elemToRemove);
    };
    while(document.querySelectorAll("#tmpScript-2").length){
      remove("#tmpScript-2");
    }
    function sinonHandler(requestsArray){
      var that = this
      this.setupServer = function(){
        this.server = sinon.fakeServer.create({ logger: console.log });
      },
      this.selectedReqs = requestsArray,
      this.interceptRequests = function() {
        that.selectedReqs.forEach(function(eachReq){
          that.server.respondWith(eachReq.method, eachReq.url,[200, { "Content-Type": "application/json" },'[{ "id": 12, "comment": "Hey there" }]']);
          that.server.respondImmediately = true
        })
      }
    }
    window.mySinonServer = new sinonHandler(${JSON.stringify([...selectedReqs])})
    window.mySinonServer.setupServer();
    window.mySinonServer.interceptRequests()
    `

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
