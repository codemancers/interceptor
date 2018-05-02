import * as axios from "axios";
import {fetchSuccess, fetchFailure} from "./../actions";

const fetchDataAlias = (payload: object) => {
  return dispatch => {
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
      .then(data => {
        dispatch(fetchSuccess(data, requestId));
      })
      .catch(err => {
        dispatch(fetchFailure(err, requestId));
      });
  };
};

export default {
  FETCH_DATA: fetchDataAlias
};
