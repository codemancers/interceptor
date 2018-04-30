import * as axios from 'axios'
import { fetchResponse, fetchSuccess, fetchFailure } from './../actions'

  const fetchDataAlias = ({payload}) => {
    return (dispatch, getState) => {
        const {method, url, requestId} = payload
        console.log(method, url, requestId)
              //dispatch(fetchResponse(payload.url, payload.method, payload.tabId))
              axios({
                method,
                url
              })
                .then( (data) => {
                  dispatch(fetchSuccess(data, requestId))
                })
                .catch( (err) => {
                  dispatch(fetchFailure(err, requestId))
                })
    }
  }

  export default {
    "FETCH_DATA": fetchDataAlias
  }