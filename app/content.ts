import * as sinon from 'sinon'
import { SinonFakeServer, SinonFakeXMLHttpRequest } from 'sinon';

interface fakeServerInterface{
  requestDetails : requestDetailInterface,
  server : object
}
interface requestDetailInterface{
  url :string,
  method : string,
  statusCode : number
}
class fakeServerWrapper {
  responseData:string
  requestDetails:SinonFakeXMLHttpRequest
  server:SinonFakeServer
  constructor() {
    this.server = sinon.fakeServer.create();
    this.StartIntercept = this.StartIntercept.bind(this);
    this.modifyResponse = this.modifyResponse.bind(this);
    this.sendResponse = this.sendResponse.bind(this);
    this.destroyServer = this.destroyServer.bind(this);
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      this.requestDetails = request.message;
      switch (request.message) {
        case 'INTERCEPT_REQUEST' : {
          this.StartIntercept(request.message);
          return
        }
        case 'STOP_INTERCEPT' : {
          this.destroyServer();
          return
        }
      }
    });
  }
  StartIntercept(message:SinonFakeXMLHttpRequest){
    this.requestDetails = message;
    this.server.xhr.useFilters = true;
    this.server.xhr.addFilter((method, url) => {
      return !(url === message.url); //has to return false
    }) 
     this.modifyResponse()
  }
  modifyResponse(){
    this.server.respondWith(this.requestDetails.method , this.requestDetails.url, [this.requestDetails.statusCode, { "Content-Type": "application/json" },JSON.stringify({msg:"Error"})] );
    this.sendResponse();
  }
  sendResponse(){
    this.server.respond();
  }
  destroyServer(){
    this.server.restore();
    return this.responseData;
  }
}
(new fakeServerWrapper()).startMessageListener();