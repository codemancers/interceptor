import {PopUpState, Action} from '../types'
const INITIAL_POPUP_STATE : PopUpState = { enabled: false , errorMessage: "", requests: [], selectedReqIds: [], checked : false}

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
      let selectedReqIds = state.selectedReqIds;
      if (action.checked) {
        selectedReqIds = [ ...selectedReqIds, action.reqId ]
        return {...state , selectedReqIds, checked : !action.checked }
      } else {
        removeReqId(state, action)
      }
    default:
      return state;
  }
}
const removeReqId = (state, action) => {
  const indexToRemove = state.selectedReqIds.findIndex((reqId) => {
    return reqId === action.reqId
  })
  return {...state, selectedselectedReqIds : state.selectedReqIds.splice(indexToRemove, 1)}
}
