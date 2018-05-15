import * as axios from "axios";
import {fetchSuccess, fetchFailure, handleRespTextChange} from "./../actions";

const fetchDataAlias = (payload: object) => {
  return (dispatch:any) => {
    console.log(payload)
    const {method, url, requestId, requestHeaders} = payload.requestDetails;
    const requestHeadersObject = requestHeaders.reduce((accumulatedObj, reqHeaderNameValuePair) => {
      accumulatedObj[reqHeaderNameValuePair.name] = reqHeaderNameValuePair.value;
      return accumulatedObj;
    }, {});
    axios({
      method,
      url,
      requestHeadersObject
    })
      .then( (data:axios.AxiosResponse) => {
        const stringifiedData = JSON.stringify(data.data);
        dispatch(fetchSuccess("", requestId));
        dispatch(handleRespTextChange(stringifiedData, requestId));
        dispatch(fetchSuccess(stringifiedData, requestId));
      })
      .catch( () => {
        dispatch(fetchFailure("Couldn't connect to server. Check your connection.", requestId));
      });
  };
};

export default {
  FETCH_DATA: fetchDataAlias
};
