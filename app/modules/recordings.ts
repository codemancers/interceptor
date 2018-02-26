import {PopUpState, Action} from '../types'
export const INITIAL_POPUP_STATE : PopUpState = { enabled: false , errorMessage: "", requests: [], selectedReqIds: [], checkedReqs : {}}

//ACTION CONSTANTS
import * as actionType from "../actions"

export const reducer = (state = INITIAL_POPUP_STATE, action: Action) => {
  switch (action.type) {
    case actionType.START_LISTENING:
      return {...state, enabled : true}
    case actionType.UPDATE_FIELD:
      return {...state, [action.name]: action.value };
    case actionType.UPDATE_FIELDS:
      return {...state,  ...action.payload};
    case actionType.STOP_LISTENING:
      return {...state, enabled: false};
    case actionType.ERROR:
      return {...state, errorMessage: action.errorMessage }
    case actionType.CLEAR_REQUESTS :
      return {...state, requests: [] }
    case actionType.TOGGLE_CHECKBOX:
      state.checkedReqs[action.reqId] = action.checked
      if (state.checkedReqs[action.reqId]) {
        return {...state , , checked : !action.checked }
      } else {
        removeReqId(state, action)
      }
    case actionType.INTERCEPT_CHECKED :
      return {...state}
    default:
      return state;
  }
}
const removeReqId = (state, action) => {
  return {...state, checked : !action.checked}
}
