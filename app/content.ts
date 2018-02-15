interface requestObject {
  url: string;
  method: string;
  requestId: number;
  timeStamp: number;
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
    });
  };
  injectScripts = () => {
    let jquery = document.createElement("script");
    jquery.defer = false;
    jquery.src = chrome.extension.getURL("./lib/jquery.js");
    (document.head || document.documentElement).appendChild(jquery);

    let sinon = document.createElement("script");
    sinon.defer = false;
    sinon.src = chrome.extension.getURL("./lib/sinon.js");
    (document.head || document.documentElement).appendChild(sinon);
  };
  initScript = (request: requestObject) => {
    var actualCode = `
    var request = ${JSON.stringify(request)};
    var sinonServer = sinon.fakeServer.create();
    //sinonServer.restore();

    sinonServer.respondWith('${request.method}', '${
      request.url
    }',[200, { "Content-Type": "application/json" },'[{ "id": 12, "comment": "Hey there" }]']);
    sinonServer.respondImmediately = true;

    $.ajax({
      url: "${request.url}",
      cache: false,
      method : "${request.method}"
    })
      .done(function(data) {
        console.log('success', data)
      })
      .fail(function(xhr) {
        console.log('error', xhr);
      });
    `;
    if (document.getElementById("tmpScript")) {
      let injectedScript = document.getElementById("tmpScript");
      injectedScript.parentNode.removeChild(injectedScript);
    }
    var script = document.createElement("script");
    script.defer = true;
    script.id = "tmpScript";
    script.type = "text/javascript";
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
  };
}
new Intercept().startMessageListener();
