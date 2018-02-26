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
      let elemToRemove = document.getElementById(querySelector);
      elemToRemove.parentNode.removeChild(elemToRemove);
    };
    if (document.getElementById("tmpScript-2")) {
      //remove("tmpScript-2");
    }
    var selectedRequests = ${JSON.stringify([...selectedReqs])};
    var sinonServer = sinon.fakeServer.create();
    //sinonServer.restore();

    selectedRequests.forEach(function(eachReq){
      console.log(eachReq)
      sinonServer.respondWith(eachReq.method, eachReq.url,[200, { "Content-Type": "application/json" },'[${JSON.stringify({"msg": "hello again"})}]']);
      sinonServer.respondImmediately = true;;
    })`

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
    var request = ${JSON.stringify(request)};
    var sinonServer = sinon.fakeServer.create();
    //sinonServer.restore();

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
