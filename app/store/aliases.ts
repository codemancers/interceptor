import * as axios from "axios";
import { fetchSuccess, fetchFailure, handleRespTextChange } from "./../actions";

interface payload {
  requestDetails: chrome.webRequest.WebRequestHeadersDetails;
  tabId: number;
  payload: any;
}
interface reqHeaderNameValuePair {
  name: string;
  value: string;
}

const fetchDataAlias = (payload: payload) => {
  return (dispatch: any) => {
    const { method, url, requestId, requestHeaders, tabId } = payload.payload.requestDetails;
    const requestHeadersObject = requestHeaders
      ? requestHeaders.reduce(
          (accumulatedObj = {}, reqHeaderNameValuePair: reqHeaderNameValuePair) => {
            accumulatedObj[reqHeaderNameValuePair.name] = reqHeaderNameValuePair.value;
            return accumulatedObj;
          },
          {}
        )
      : {};
    axios({
      method,
      url,
      requestHeadersObject
    })
      .then((data: axios.AxiosResponse) => {
        const stringifiedData = JSON.stringify(data.data);
        dispatch(fetchSuccess("", requestId, tabId));
        dispatch(handleRespTextChange(stringifiedData, requestId, tabId));
        dispatch(fetchSuccess(stringifiedData, requestId, tabId));
      })
      .catch(() => {
        dispatch(
          fetchFailure("Couldn't connect to server. Check your connection.", requestId, tabId)
        );
      });
  };
};

export default {
  FETCH_DATA: fetchDataAlias
};
