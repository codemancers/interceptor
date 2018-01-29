import {PopUpState, Action} from '../types'
const INITIAL_POPUP_STATE : PopUpState = { enabled: false , errorMessage: "",requests: []}

//ACTION CONSTANTS
import * as actionType from "../actions"

export const reducer = (state = INITIAL_POPUP_STATE, action: Action) => {
  console.log(action)
  switch (action.type) {
    case actionType.START_LISTENING:
      return {...state, enabled : true}
    case actionType.UPDATE_FIELD:
      return {...state, requests : action.requests };
    case actionType.STOP_LISTENING: 
      return {...state, enabled: false};
    case actionType.ERROR: 
      return {...state, errorMessage : action.errorMessage }
    case actionType.CLEAR_REQUESTS : return {...state, requests: clearRequestsArray (state) }
    case actionType.RELOAD_REQUESTS : reloadDataReducer (state, action)
      return
    default:
      return state;
  }
}
const clearRequestsArray = (state:PopUpState) => {
  const clonedArray = state.requests.requests.slice(0)
  return clonedArray
}
const reloadDataReducer = (state:PopUpState, action:Action) => {
  let incomingRequests:any = [];
  incomingRequests = action.requests;
  return {...state, requests : incomingRequests}
}


