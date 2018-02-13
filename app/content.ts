import * as $ from 'jquery'
interface requestObject{
  url:string;
  method:string;
  requestId:number,
  timeStamp:number
}
class Intercept {
  requestDetail: object;
  constructor() {
    this.requestDetail = {};
    this.startMessageListener = this.startMessageListener.bind(this);
    this.injectScripts = this.injectScripts.bind(this);
    this.initScript = this.initScript.bind(this);
    this.injectScripts();
  }
  startMessageListener = () => {
    chrome.runtime.onMessage.addListener((request, _, __) => {
      if (request.message == "INTERCEPT_REQUEST") {
        this.initScript(request);
      }
    });
  };
  injectScripts = () => {
    var jquery = document.createElement("script");
    jquery.defer = false;
    jquery.src = chrome.extension.getURL("./lib/jquery.js");
    (document.head || document.documentElement).appendChild(jquery);

    var sinon = document.createElement("script");
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
    }',[404, { "Content-Type": "application/json" },'[{ "id": 12, "comment": "Hey there" }]']);

    sinonServer.respondImmediately = true;

    sinonxhr = sinon.useFakeXMLHttpRequest();
    // Create an array to store requests
    var requests = this.requests = [];
    // Keep references to created requests
    sinonxhr.onCreate = function (xhr) {
      requests.push(xhr);
      console.log(requests)
    };

    var req = new XMLHttpRequest();
    req.open("${request.method}", "${request.url}", false);
    req.send(null);
    console.log(req.responseText);

     //axios.get('${request.url}').then(function(res){console.log(res)}).catch(function(err){console.log(error)})
    // $.ajax({
    //   url: "${request.url}"}).done(function(data) {console.log('success', data)}).fail(function(xhr) { console.log('error', xhr); });
    //
    `
    $("#tmpScript").remove();//remove the earlier script tag if present
    var script = document.createElement("script");
    script.defer = true;
    script.id = 'tmpScript';
    script.type= 'text/javascript';
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
  };
}
new Intercept().startMessageListener();
