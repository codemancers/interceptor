var requestCount = {}
var initialize = function(urls, enabledTabId) {
  console.log(enabledTabId);
  if(!urls){
    urls = ["<all_urls>"];
  }

  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      var tabId = details.tabId;
      requestCount[tabId] = requestCount[tabId] || 0;
      requestCount[tabId] += 1;
      chrome.browserAction.setBadgeText({text: '' +  requestCount[tabId], tabId: tabId});
    },
    {urls: urls, types: ["xmlhttprequest"], tabId: enabledTabId},
    ["blocking"]
  );
  // Listen to beforesendheaders and use request ID to keep collection info.


  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo.status == "loading") {
      requestCount[tabId] = 0;
    }
  });

  chrome.tabs.onRemoved.addListener(function(tabId){
    delete requestCount[tabId];
  })
}

var enableLogging = function(url, tabId) {
  initialize(null, tabId);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.message == "ENABLE_LOGGING"){
    enableLogging(request.url, request.tabId)
  }
});

//initialize();
