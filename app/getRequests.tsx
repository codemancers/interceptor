let requestsArr:Array<Object> = [{url : "", requestBody: undefined , method : "", type: ""}]

chrome.webRequest.onBeforeRequest.addListener(
function(details) {
	if(details.requestBody) requestsArr.push({url : details.url, requestBody: details.requestBody, method : details.method, type: details.type})
	else requestsArr.push({url : details.url, method : details.method, type: details.type})
},
{urls: ["<all_urls>"]},
["blocking"]);

export default requestsArr
