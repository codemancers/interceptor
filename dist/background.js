var requestCount = {}
var initialize = function(urls, enabledTabId) {
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
    {urls: urls, types: ["xmlhttprequest"]},
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

initialize();
